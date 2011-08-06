//                             fget.h                  
//
// (C) Copyright 2011, Constantine Apostolou, All Rights Reserved.
//
//        This software comes with Cinux, the Greek Linux
//         conmarap@osarena.net - http://www.osarena.net
//

#include <stdio.h>

#define FTP             "ftp -n"        /* how to invoke FTP in silent mode */
#define TEMPFILE        ".fget.tmp"     /* the temp file for building cmds */
#define ANONFTP         "ftp"           /* anonymous FTP user account */

#define SLEN            256             /* length of a typical string */
#define NLEN            40              /* length of a short string   */

char *basename_of(), *getenv();
