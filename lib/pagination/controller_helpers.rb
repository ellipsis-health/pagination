module Pagination
  module ControllerHelpers
    module ClassMethods
      def paginate_json *actions
        actions.each do |action|
          alias_method("orig_#{action}".to_sym, action)
          define_method(action) do 
            paginate_wrapper { send("orig_#{action}".to_sym) }
          end
        end
      end
    end
 
    def self.included base
      base.extend ClassMethods
    end
     
    def redirect_with_pagination?
      not params.include?(:per_page) or not params.include?(:page)
    end

    def paginate_filter
      redirect_to({per_page: '10', page: '1'}.merge(params)) and return if redirect_with_pagination?
    end

    def paginate_wrapper
      paginate_filter
      @results = yield.paginate(:per_page => params[:per_page], :page => params[:page])
      respond_to do |format|
        format.json {render json: @results}
      end
    end
  end
end
