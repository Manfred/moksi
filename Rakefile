task :default => :test

desc "Run all unit tests"
task :test do
  sh "jstest #{Dir['test/*.html'].join(' ')}"
end