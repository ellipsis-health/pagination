$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "pagination/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "pagination"
  s.version     = Pagination::VERSION
  s.authors     = ["Dieterich Lawson"]
  s.email       = ["dieterich.lawson@gmail.com"]
  s.homepage    = "ellipsishealth.com"
  s.summary     = "Page your relations"
  s.description = "Provides a set of convenience methods for working with pagination and tables."

  s.files = Dir["{app,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]

  s.add_dependency "rails", "~> 3.2.11"
  s.add_dependency "jquery-rails"
end
