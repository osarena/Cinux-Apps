#!/usr/bin/perl -w
#
# This script has been created for Cinux Shell
# It's purpose is to shut down the local computer
#
# author: Constantine M. Apostolou <conmarap@gmail.com>
#

# Add the proper directory paths

$ENV{'PATH'} = '/bin:/usr/bin:/usr/local/bin';

# Print the proper debug message
print "Requested to bring down the system...\n";

# Call the "shutdown" function from the sbin dir
# This won't work if the default user is any other
# than root, so beware!
system('/sbin/shutdown -h now');

# End of Perl script

# TODO: Test this: Create a perl script that calls the CinuxShell 
#       executable and after it terminates, it shuts down the pc
