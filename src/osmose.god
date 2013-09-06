God.watch do |w|
  w.name = "osmose"
  w.dir = "/home/ubuntu/2013-fb-group-11"
  w.uid = 'ubuntu'
  w.start = "sudo sails lift"
  w.log = "/var/log/opt/osmose-god.log"
  w.keepalive
end