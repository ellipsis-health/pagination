require 'pagination/engine'
require 'pagination/controller_helpers.rb'
require 'pagination/active_record.rb'

# Controller Helpers
ActionController::Base.send(:include, Pagination::ControllerHelpers)

# ActiveRecord Extensions
::ActiveRecord::Base.extend Pagination::ActiveRecord::Pagination

klasses = [::ActiveRecord::Relation]
if defined? ::ActiveRecord::Associations::CollectionProxy
  klasses << ::ActiveRecord::Associations::CollectionProxy
else
  klasses << ::ActiveRecord::Associations::AssociationCollection
end

# support pagination on associations and scopes
klasses.each { |klass| klass.send(:include, Pagination::ActiveRecord::Pagination) }
