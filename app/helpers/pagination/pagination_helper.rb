module Pagination
  module PaginationHelper
    def prev_page results 
      [results.page - 1, 1].max
    end

    def next_page results
      [results.page + 1, results.num_pages].min
    end

    def pages results
      if results.page - 2 < 1
        return (1..[5, results.num_pages].min)
      elsif results.page + 2 > results.num_pages
        return ([1, results.num_pages - 4].max..results.num_pages)
      else 
        return (results.page - 2..results.page + 2)
      end
    end

    def page_link text, params, page
      link_to text, params.merge({page: page})
    end

    def pagination_links_for results
      render 'pagination/links', {:results => results}
    end
  end
end
