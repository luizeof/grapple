module Grapple
	module Components
		class SearchForm < HtmlComponent

			setting :components, [:body, :search_query_field, :search_submit]
			setting :page_param, 'page'
			setting :form_class, 'search-form'

			def render(*options, &block)
				options = options[0] ? options[0] : {}
				form_classes = [form_class]
				html = ''
				html << template.form_tag({}, { :class => form_classes.join(' ') })
				html << template.hidden_field_tag(page_param, 1)
				# TODO: don't use tables for vertical alignment
				html << '<table><tr>'
				render_components(components, options, &block).each do |c|
					html << "<td>#{c}</td>\n"
				end
				html << '</tr></table>'
				html << '</form>'
				html.html_safe
			end

		end
	end
end
