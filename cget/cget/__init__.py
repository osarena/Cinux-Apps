# =================================================================================
# 
# Cinux-Get: Cinux Package Manager (cget) 
# Author   : Constantine M. Apostolou <conmarap@osarena.net>
# Version  : 0.1.0.121
# Initial Release : September 02 2011
# Latest Release  : October 18 2011
# 
# This piece of software is supposed to parse a certain package
# compatable with Cinux and install it on the current machine.
#           
# =================================================================================
# LICENSE
# 
# Copyright (C) 2011 Constantine Apostolou - conmarap@osarena.net
# This program is free software: you can redistribute it and/or modify it 
# under the terms of the GNU General Public License version 3, as published 
# by the Free Software Foundation.
# 
# This program is distributed in the hope that it will be useful, but 
# WITHOUT ANY WARRANTY; without even the implied warranties of 
# MERCHANTABILITY, SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR 
# PURPOSE.  See the GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License along 
# with this program.  If not, see <http://www.gnu.org/licenses/>.
# 
# =================================================================================

# Imports listed bellow
import logging
import optparse
import os
import sys
import gettext
#import anydbm
import urllib2

from gettext import gettext as _
gettext.textdomain('cget')

from cget import cgetconfig

LEVELS = (  logging.ERROR,
            logging.WARNING,
            logging.INFO,
            logging.DEBUG,
            )

# =================================================================================
# This is the server

destination = 'http://dl.dropbox.com/u/28053859/Cinux_Packages/'
sourceforge = 'https://sourceforge.net/projects/cinux/files/'

# =================================================================================
# These are the available to download files
# TODO: Add customized packages for:
#       * Adobe Reader
#       * Adobe Flash Player
#       * Skype
#       
#       and others
# =================================================================================

# This type of database/list can be replased from a single file
# Sample apps: 
xx = ['cinuxscreen', 'cinuxstatus', 'pidgin']

# =================================================================================

# And these are their binary names
yy = ['cinux-cl.png', 'Cinux_status.txt', 'cpkg/Pidgin/pidgin.tar.gz']

# =================================================================================
# 
# Our exit function
# 
# =================================================================================
def exit():
  sys.exit(0)
  
# =================================================================================
# 
# Our uninstall function - Package uninstallation process
# 
# =================================================================================
def uninstall(cpkg):
  print '* [ Mod:Uninstalling package: %s ]' %cpkg
  # TODO: Search for cpkg's uninstallation script in ~/.cget_scripts and then read
  # the file line by line while executing the "rm" command for each line. Then, the
  # last thing to do is clean up the temp files and exit the program with exit().
  try:
    # Since this was tested on Ubuntu, the "/home/apostolou" field should
    # be replased by "/root", since Cinux is only root dependent
    f = open('/home/apostolou/.cget_scripts/' + cpkg)
    print '* [ Inf:Found package, attempting to uninstall ]'
    while 1:
      line = f.readline()
      if not line: break
      else:
	command = 'rm ' + line
	os.system(command)
    f.close()
  except IOError:
    print '* [ Err:No package \'%s\' installed on this computer ]' %cpkg
    
  print '* [ Inf:Package successfully uninstalled ]'
  print '* '
  exit()
  
# =================================================================================
# 
# Our unpacking function - Package installation process
# 
# =================================================================================
def unpack(cpkg):
  print '* [ Mod:Unpacking downloaded package. ]'
  os.system('mkdir ~/Downloads/.cget_temp')
  os.system('tar xf %s' %cpkg)
  print '* [ Mod:Copying files. ]'
  os.system('mv app ~/Downloads/.cget_temp')
  os.system('mv scripts ~/Downloads/.cget_temp')
  print '* [ Mod:Cleaning up. ]'
  # In any other OS that uses sudo and non root users
  # this should be done as a root and not as a simple
  # user. So fix this.
  os.system('rm *.tar.gz')
  os.system('rm -rf app')
  os.system('rm -rf scripts')
  os.system('cp -r ~/Downloads/.cget_temp/app/* /')
  os.system('rm -rf ~/Downloads/.cget_temp')
  

# =================================================================================
# 
# Our download function
# 
# =================================================================================
def download(url):
  """Copy the contents of a file from a given URL
  to a local file.
  """
  yelper = 0;
  import urllib
  import urllib2
  print '* [ Mod:Downloading the requested file. ]'
  length = len(url.split('/'))
  #print url.split('/')[length - 1] # This was just to verify if it does what I want
  if ".tar.gz" in url.split('/')[length - 1]:
    print '* [ Inf:This is a Cinux Package ]'
    #url = sourceforge + url
    os.system('wget %s -a log.log' %(sourceforge + url))
    print '* [', url.split('/')[length - 1], ' ]'
    unpack(url.split('/')[length - 1])
    print '* '
    print '* [ Inf:Package installed ]'
    #os.system('rm -r ~/Downloads/.cget_temp')
    exit()
  else:
    print '* [ Inf:This is a neutral file ]'
    url = destination + url
    
  webFile = urllib.urlopen(url)
  
  try:
    try:
	# Try to retrieve google
	u = urllib2.urlopen('http://google.com')
    except HTTPError as e:
        # Network is not available error and then exit
    	print '* [ Err:Package not found on repository or connection lost ]'
	# If an error is encountered, then exit the program
        exit()
    except URLError as e:
	# Network is not available error and then exit
	print '* [ Err:Package not found on repository or connection lost ]'
	# If an error is encountered, then exit the program
        exit()
    except Exception as e:
	# General network error and then exit
	print '* [ Err:General network error ]'
	# If an error is encountered, then exit the program
        exit()
        
    localFile = open('/home/apostolou/Downloads/' + url.split('/')[-1], 'wb')
    localFile.write(webFile.read())
    
    # ======================================================
    # This can take the above commands place
    #urllib.urlretrieve (url, url.split('/')[-1])
    #
    # This is to be used if the bug above can not be fixed
    #os.system('wget %s -a log.log' % url)
    # ======================================================
  except:
    yelper = 1
    print '* [ Err:Could not download the requested file!]'
    exit()
    
  webFile.close()
  #localFile.close()
  print '* [ Inf:Nothing to do with this file ]'

# =================================================================================
# 
# Our main function
# 
# =================================================================================
import urllib
def main():
    import urllib2
    print '* '
    print '* [ Inf:Cinux-Get - type \'cget -h\' for help ]'
    print '* '
    version = cgetconfig.__version__
    
    # Support for command line options.
    usage = _("cget [options]")
    parser = optparse.OptionParser(version="%%prog %s" % version, usage=usage)
    
    # dumb python options
    parser.add_option('-d', '--debug', dest='debug_mode', action='store_true',
        help=_('Print the maximum debugging info (implies -vv)'))
    
    #parser.add_option('-v', '--verbose', dest='logging_level', action='count',
    #    help=_('set error_level output to warning, info, and then debug'))
    
    # package install option
    parser.add_option("-i", "--install", action="store", dest="foo",
        help=_("Download a package for Cinux"))
        
    # package uninstall option
    parser.add_option("-u", "--uninstall", action="store", dest="uninstall",
        help=_('See the list of available packages you can download:'))
    
    # package list option
    parser.add_option("-p", "--pkgs", action="store_true", dest="packages",
        help=_('See the list of available packages you can download:'))
    parser.set_defaults(logging_level=0, foo=None)
    (options, args) = parser.parse_args()

    # set the verbosity
    if options.debug_mode:
        options.logging_level = 3
        print 'Verbosity set to level 3'
    logging.basicConfig(level=LEVELS[options.logging_level], format='%(asctime)s %(levelname)s %(message)s')
    
    positive = 'y'
    exit = 'e'
    
    if options.uninstall:
      ans = raw_input('* [ War:Are you sure you want to uninstall this package? (y/n) ]: ')
      if ans == positive: #positive in ans:
	uninstall(options.uninstall)
      else:
	exit()
    
    if options.packages:
      print '*  Total packages:'
      print '* '
      i = 0
      
      # Now print each package that exist in the local database/list xx
      for word in xx:
	print '*    ', i + 1, '. ', xx[i]
	i=i+1
	
      print '* '
          
    # Our main function
    if options.foo:
        # Check if Internet is available on this machine
	print '* [ Mod:Checking network status on this computer ]'
        try:
	  # Try to retrieve google
	  u = urllib2.urlopen('http://google.com')
	  print '* [ Inf:Network OK ]'
	  #urllib2.retrieve('http://google.com')
        #except HTTPError as e:
	#  # Network is not available error and then exit
	#  print '* [ Err:Network is either not available or your computer cant connect to the internet properly ]'
        #  exit()
        #except URLError as e:
	#  # Network is not available error and then exit
	#  print '* [ Err:Network is either not available or your computer cant connect to the internet properly ]'
        #  exit()
        except Exception as e:
	  # General network error and then exit
	  print '* [ Err:Network is not available or your computer can\'t connect to the internet ]'
          exit()
        try:
            var1 = 0
            for i in range(0, len(xx)):
                if options.foo == xx[i]:
                    var1 = 1
                    try:
		      download(yy[i])#options.foo)
		    except IOError:
                      print '* [ Err:The file you requested does not exist ]'
                      print '* [ Inf:Exiting Cinux-Get ]'
                      exit()
                    break
                else:
                    var1 = 0
            if var1 == 1:
                print '* [ Inf:The file you requested has been downloaded ]'
                print '* '
            else:
                print '* [ Err:The file you requested does not exist ]'
                print '* [ Inf:Exiting Cinux-Get ]'
	except IOError:
            print '* [ Err:The file you requested could not be found or downloaded...'
            print '* [ Inf:Please check if internet is available or if the file exists'
            print '* [ Inf:Exiting Cinux-Get ]'

    logging.debug(_('end of prog'))


if __name__ == "__main__":
    main()
