class Image < ApplicationRecord
  belongs_to :email, optional: true

  has_attached_file :asset
    validates_attachment_content_type :asset,
    :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"],
    :path => ":rails_root/public/uploads/images/:id_:style_:fingerprint.:extension",
    :url => "/uploads/images/:id_:style_:fingerprint.:extension"

  def data_with_base64
     image_base64 = Base64.encode64(open(asset.path).to_a.join)
     asset_base64 = "data:#{asset_content_type};base64,#{image_base64}"
     image_data = attributes.slice('id', 'link', 'alt', 'asset_file_name')
     image_data[:asset] = asset_base64
     image_data
  end

  def image_el template_width
    width = template_width == 'responsive' ? 'width="100%"' : "width=\"#{template_width}\""
    "<tr>
      <td #{width}>
        #{ link_for_a_tag ? a_img_tag_el(width) : img_tag_el(width) }
      </td>
    </tr>"
  end

  private

  def img_tag_el width
    "<img style=\"display: block;\" border=\"0\" src=\"#{asset.path}\" alt=\"#{alt}\" #{width} style=\"max-width:100%\"/>"
  end

  def a_img_tag_el width
    "<a href=\"#{link_for_a_tag}\" target=\"_blank\"> #{img_tag_el(width)} </a>"
  end

  def link_for_a_tag
    link.present? && link !~ /^http/ ? "https://#{link}" : link
  end
end
