class Email < ApplicationRecord
  has_many :images, dependent: :destroy
  belongs_to :template

  accepts_nested_attributes_for :images, allow_destroy: true

  serialize :js_links
  serialize :css_links
  serialize :tracking_pixels

  before_save :handle_name
  after_save :update_nde

  def nested_email_data
    email_data = attributes
    email_data[:images_attributes] = images.order(:position).map(&:data_with_base64)
    email_data
  end

  private

  def handle_name
    self.name = self.name.strip
  end

  def update_nde
    unless self.changed_attributes.key?('nde')
      self.nde = template.html.gsub("{{tracking_pixels}}", tracking_pixels_el)
        .gsub("{{js and css}}", js_links_el + css_links_el + css_content_el)
        .gsub("{{content}}", content_el)
      save
    end
  end

  def content_el
    email_type == 'client_html' ? html : image_table_el
  end

  def tracking_pixels_el
    tracking_pixels.map do |pixel|
      "<a><img src=\"#{pixel}\" width=\"1\" height=\"1\" border=\"0\" style=\"display:none;\"></a>"
    end.join(' ')
  end

  def js_links_el
    js_links.map { |link| "<script src=\"#{link}\"></script> \n" }.join('')
  end

  def css_links_el
    css_links.map { |link| "<link rel=\"stylesheet\" type=\"text/css\" href=\"#{link}\" /> \n" }.join('')
  end

  def css_content_el
    "<style> #{css_content} </style>"
  end

  def image_table_el
    template_width = template.width 
    table_width = template_width == 'responsive' ? 'width="100%"' : "width=\"#{template_width}\""
    images_el = images.order(:position).map { |image| image.image_el(template_width) }.join('')

    "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" #{table_width} style=\"max-width:640px\">
      #{images_el}
    </table>"
  end
end
