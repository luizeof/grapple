module Grapple
	module Components
		class WillPaginatePagination < HtmlComponent

			setting :no_results_message, :no_search_results

			def render(paginate_parameters = {})
				if records.instance_of?(Array)
					html = '&nbsp;'
				elsif !params[:query].blank? and records.empty?
					html = h(t(no_results_message))
				else
					html = template.will_paginate(records, paginate_parameters) || '&nbsp;'
				end

				builder.row "<td colspan=\"#{num_columns}\">#{html}</td>"
			end
		
		end
	end
end
