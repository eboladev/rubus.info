require 'liquid'
require 'redcarpet'
require 'htmlentities'

module TextFilter
  def markdown(input)
    parser = Redcarpet.new(input, :smart,
                                  :hard_wrap,
                                  :tables,
                                  :fenced_code,
                                  :strikethrough,
                                  :lax_htmlblock,
                                  :no_intraemphasis)
    parser.to_html
  end

  def date(input)
    Time.now.strftime(input)
  end

  def htmlencode(input)
    HTMLEntities.new.encode(input)
  end

  def downcase(input)
    input.downcase
  end
end
