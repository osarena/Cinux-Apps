#!/usr/bin/perl -w
#
# This script has been created for Cinux Shell
# It's purpose is to shut down the local computer
#
# author: Constantine M. Apostolou <conmarap@gmail.com>
#

# Add the proper directory paths
use strict;
use CGI;

my $q = new CGI;
my $path = "shutdown.pl";
my $return_statys = system('/usr/bin/perl', $path);

print $q->header;

# End of Perl script
