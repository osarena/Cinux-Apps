#!/usr/bin/env python

"""File downloading from the web.
"""

def download(url):
	"""Copy the contents of a file from a given URL
	to a local file.
	"""
	import urllib
	webFile = urllib.urlopen(url)
	localFile = open(url.split('/')[-1], 'w')
	localFile.write(webFile.read())
	webFile.close()
	localFile.close()

if __name__ == '__main__':
	import sys
	if len(sys.argv) == 2:
                if sys.argv[0][0] == '-':                # find "-name value" pairs
                    opts[sys.argv[0]] = sys.argv[1]            # dict key is "-name" arg 
                    if sys.argv[1] == 'install': 
                        try:
			    download(sys.argv[1])
		        except IOError:
			    print 'Filename not found.'
                    #sys.argv = sys.argv[2:]                    
                else:
                    sys.argv = sys.argv[1:]
		
	else:
		import os
                print 'cget - copyright 2011 Constantine Apostolou'
                print ' The Cinux project'
		print 'usage: cget <link to remote file>'# os.path.basename(sys.argv[0])
