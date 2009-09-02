task :default => :test

desc "Run all unit tests"
task :test do
  sh "jstest #{Dir['test/runners/*.html'].join(' ')}"
end