from fabric.api import *
import datetime

env.user = 'ubuntu'
env.hosts = ['54.254.140.139']
env.port = '22'
env.use_ssh_config = True
env.key_filename = '~/.ssh/osmose.pem'

def deploy():
  with cd('~/Osmose'):
    run('git remote update && git reset --hard origin/master')
    run('sudo npm install')
    with settings(warn_only=True):
    	run('./d')
    run("./s")

def setup():
  with cd('~'):
    run('git clone https://github.com/CS3216/2013-fb-group-11.git')


