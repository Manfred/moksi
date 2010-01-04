task :default => :test

desc "Run all unit tests"
task :test do
  sh "jstest #{Dir['test/runners/*.html'].join(' ')}"
end

desc "Build distribution version"
task :build do
  $:.unshift File.expand_path('../vendor/sprockets/lib', __FILE__)
  require 'sprockets'
  
  source_dir = File.expand_path('../src', __FILE__)
  secretary = Sprockets::Secretary.new(
    :root         =>  source_dir,
    :load_path    => [source_dir],
    :source_files => ['moksi.js']
  )
  secretary.concatenation.save_to(File.expand_path('../dist/moksi.js', __FILE__))
  
  source_dir = File.expand_path('../src/moksi', __FILE__)
  secretary = Sprockets::Secretary.new(
    :root         =>  source_dir,
    :load_path    => [source_dir],
    :source_files => ['sample.js']
  )
  secretary.concatenation.save_to(File.expand_path('../dist/moksi/sample.js', __FILE__))
end