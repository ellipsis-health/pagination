module Pagination
  module ControllerHelpers
        
    def redirect_with_pagination?
      not params.include?(:per_page) or not params.include?(:page)
    end

    def paginate_filter
      redirect_to({per_page: '10', page: '1'}.merge(params)) and return if redirect_with_pagination?
    end
  end
end
