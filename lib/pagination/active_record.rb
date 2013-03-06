module Pagination
  module ActiveRecord
    module RelationMethods

      def total_entries
        if limit_value
          excluded = [:order, :limit, :offset]
          excluded << :includes unless eager_loading?
          rel = self.except(*excluded)
          rel.count
        else
          super
        end
      end

      def num_pages
        (total_entries / per_page.to_f).ceil
      end

      def page
        (offset_value / per_page) + 1
      end

      def per_page
        limit_value
      end

      def as_json opts
        results = super opts
        {page: page, per_page: per_page, num_pages: num_pages, results: results}
      end
    end
    module Pagination
      def paginate opts
        page_num  = (opts.delete(:page)  || 1).to_i
        per_page = (opts.delete(:per_page) || 10).to_i
        rel = if ::ActiveRecord::Relation === self
          self
        elsif !defined?(::ActiveRecord::Scoping) or ::ActiveRecord::Scoping::ClassMethods.method_defined? :with_scope
          # Active Record 3
          scoped
        else
          # Active Record 4
          all
        end
        num_pages = (rel.count / per_page.to_f).ceil
        page_num = num_pages if page_num > num_pages
        rel = rel.extending(RelationMethods)
        rel = rel.limit(per_page).offset(per_page * (page_num - 1))
        rel
      end
    end
  end
end
