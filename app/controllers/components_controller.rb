class ComponentsController < ApplicationController
  def index
    # Showcase page for all UI components
  end
  
  def preview
    @component = params[:component]
    @variant = params[:variant]
    
    render layout: false if request.xhr?
  end
end