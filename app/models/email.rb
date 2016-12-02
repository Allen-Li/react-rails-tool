class Email < ApplicationRecord
  has_many :images, dependent: :destroy
  belongs_to :template

  accepts_nested_attributes_for :images

  serialize :js_links
  serialize :css_links
  serialize :tracking_pixels

  before_save :handle_name

  def nested_email_data
    email_data = attributes
    email_data[:images_attributes] = images.order(:position).map(&:data_with_base64)
    email_data
  end

  private

  def handle_name
    self.name = self.name.strip
  end
end
