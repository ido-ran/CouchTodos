# ===========================================================================
# Project:   Todos
# Copyright: ©2010 My Company, Inc.
# ===========================================================================

# Add initial buildfile information here
config :all, :required => :sproutcore

proxy '/todos', :to => 'localhost:5984'
