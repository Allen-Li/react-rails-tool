class EmailsController < ApplicationController
  before_action :template_optins, only: [:new, :edit]

  def index
    emails_data
  end

  def destroy
    begin
      Email.find(params[:id]).destroy
      render json: { message: 'Delete email successfully', emails_data: emails_data }, status: 200
    rescue Exception => e
      render_error(e)
    end
  end

  def create
    begin
      Email.create!(permit_params)
      render json: { message: 'New email successfully'}, status: 200
    rescue => e
      render_error(e)
    end
  end

  def edit
    @email = Email.find(params[:id]).nested_email_data
  end

  def update
    begin
      Email.find(params[:id]).update_attributes(permit_params)
      redirect_to emails_path
    rescue Exception => e
      render_error(e)
    end
  end

  def download
    email = Email.find(params[:id])
    send_data email.nde, filename: "#{email.name}.html"
  end

  def preview
    email = Email.find(params[:id])
    render html: email.nde.html_safe
  end

  private

  def emails_data
    @emails = Email.includes(:template).order('emails.updated_at DESC').map do |email|
      {
        id: email.id,
        name: email.name,
        path: email.path,
        template_name: email.template.try(:name),
        created_at: email.created_at.strftime('%m/%d/%Y'),
        updated_at: email.updated_at.strftime('%m/%d/%Y')
      }
    end
  end

  def template_optins
    @template_options = Template.all.order('created_at DESC').map do |template|
      {value: template.id, label: template.name}
    end
  end

  def permit_params
    params.permit(
      :name,
      :html,
      :template_id,
      :email_type,
      :css_content,
      js_links: [],
      css_links: [],
      tracking_pixels: [], 
      images_attributes: [:asset, :asset_file_name, :alt, :link, :id, :_destroy, :position]
    )
  end
end
