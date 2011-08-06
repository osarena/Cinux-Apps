//                             cget.c           
//
//        The main utility of cget is located in this file
//
// (C) Copyright 2011, Constantine Apostolou, All Rights Reserved.
//
//        This software comes with Cinux, the Greek Linux
//         conmarap@osarena.net - http://www.osarena.net
//

#include "cget.h"

main(argc, argv)
int argc;
char **argv;
{
        FILE *fd;
        char buffer[SLEN], username[NLEN], hostname[NLEN];
        char remotehost[SLEN], remotefile[SLEN], localfname[SLEN];

        // if the user gives no or few arguments invoke the usage util
        if (argc < 2) usage();  

        splitword(argv[1], remotehost, remotefile);     /* split host/file */

        if (argc == 2) strcpy(localfname, basename_of(remotefile));
        else           strcpy(localfname, argv[2]);

        // get the user that will try to get access to the remote server
        initialize(username, hostname); 

        if ((fd = fopen(TEMPFILE, "w")) == NULL) {
          fprintf(stderr,
             "Couldn't open tempfile '%s': move into your home directory?\n",
             TEMPFILE);
          exit(1);
        }

        // go on building the information to give to the ftp server in the temp file

        fprintf(fd, "Encription -> ascii\nRequest user -> %s %s@%s\n", ANONFTP, username, hostname);

        if (strlen(remotefile) == 0) {
          if (strlen(localfname) > 0)           /* directory specified? */
            fprintf(fd, "cd %s\n", localfname); /*     add 'cd' command */
          fprintf(fd, "dir\n");            
        }
        // try to fetch the file from the remote server
        else    
          fprintf(fd, "get %s %s\n", remotefile, localfname);

        fprintf(fd, "\n");

        fclose(fd);

        // after building the input file, hand it over to the 'ftp'

        sprintf(buffer, "ftp -n %s < %s; rm %s", remotehost,TEMPFILE,TEMPFILE);

        exit(system(buffer));
}
