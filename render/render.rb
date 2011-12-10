#!/usr/bin/env ruby

require 'fileutils'
require 'time'
require 'liquid'
require 'yaml'
%w[filter breadcrumbs].map do |x|
  require File.join(File.dirname(__FILE__), "#{x}.rb")
end

class Renderer
  def initialize
    config_file = File.join(File.dirname(__FILE__), '..', 'dotcloud.yml')
    config_file += '.dist' unless File.file?(config_file)
    
    config   = YAML.parse(File.open(config_file))
    @appname = config.value.keys[0].value
    
    
    # I guess this is 1.9.3-specific?
    #config   = YAML.parse(File.open(config_file)).to_ruby
    #@appname = config.keys[0]
    #@config  = config[@appname]

    Liquid::Template.register_filter(TextFilter)
    @old_root = File.expand_path(File.join(File.dirname(__FILE__), '..', 'public'))
    @new_root = File.expand_path(File.join(File.dirname(__FILE__), '..', 'static'))

    @template = File.open(File.join(File.dirname(__FILE__), '..', 'template.html')) do |f|
      f.read
    end

    FileUtils.mkdir_p(@new_root)
  end

  def css?(file)
    file.end_with?('.css')
  end

  def javascript?(file)
    file.end_with?('.js')
  end

  def markdown?(file)
    file.end_with?('.md') || file.end_with?('.markdown')
  end

  def inc?(file)
    file.end_with?('.inc')
  end

  def render_all
    render(@old_root)
  end

  def render(dir)
    pretty_dir = dir.gsub(@old_root, '')
    pretty_dir = '/' if pretty_dir.empty?
    puts "Entering #{pretty_dir}..."
    Dir["#{dir}/*"].map do |f|
      pretty = f.gsub(@old_root, '')
      if File.directory?(f)
        render(f)
      elsif File.file?(f)
        save_file(f)
      end
    end
    puts "Leaving #{pretty_dir}..."
  end

  def copy_file(file, raw = true)
    text = File.open(file, 'rb') {|f| f.read }
    
    save_file(file, text)
  end

  def save_file(file)
    old_file = File.join(File.expand_path(File.dirname(file)), File.basename(file))
    new_dir = File.dirname(old_file).sub(@old_root, @new_root)
    new_file = old_file.sub(@old_root, @new_root)
    
    text = File.open(file, 'rb') {|f| f.read }

    if markdown?(file) || inc?(file)
      text = parse_file(file, true)
      new_file.sub!(/\.(md|markdown|inc)$/, '.html')
    elsif css?(file) || javascript?(file)
      text = parse_file(file)
    else
      text = File.open(old_file, 'rb') {|f| f.read }
    end
    
    FileUtils.mkdir_p(new_dir)

    File.open(new_file, 'wb') {|f| f.print text }
  end

  def parse_liquid(text, opts)
    t = Liquid::Template.parse(text)
    t.render(opts)
  end

  def parse_file(file, html = false)
    content = File.open(file) {|f| f.read }
    breadcrumbs = BreadCrumbs.new(file)
    opts = {
            'breadcrumbs' => breadcrumbs,
            'title'       => @config['environment']['title'].value
            
            # I guess this is 1.9.3-specific?
            #'title'       => @config['environment']['title']
           }
    content = parse_liquid(content, opts)
    
    return content unless html
    
    opts['content'] = content
    parse_liquid(@template, opts)
  end
end

Renderer.new.render_all
