//                           utils.c                
//
// Utilities used in the FGET program. See "fget.c" for more info.
//
// (C) Copyright 2011, Constantine Apostolou, All Rights Reserved.
//
//        This software comes with Cinux, the Greek Linux
//         conmarap@osarena.net - http://www.osarena.net
//

#include "cget.h"

initialize(username, hostname)
char *username, *hostname;
{
        /** figure out username and hostname for this system **/

        if (strcpy(username, getenv("USER")) == NULL)
          strcpy(username, getenv("LOGNAME"));

        gethostname(hostname, NLEN);
}

splitword(buffer, word1, word2)
char *buffer, *word1, *word2;
{
        /** Given a buffer that's in the form of host.name:/file/path, break
            it into two words around the colon, with the first word stored as
            word1, and the second as word2. Initialize word2 to NULL if no
            argument is present.  **/

        register int i, j = 0;

        for (i=0; buffer[i] != ':' && buffer[i] != 0; i++)   /* copy word1 */
          word1[i] = buffer[i];
        word1[i] = 0;

        word2[0] = 0;                   /* initialize word2 to NULL */

        if (buffer[i] == 0) return;     /* no colon or nothing following it */

        i++;                            /* skip the colon */

        while (buffer[i] != 0)          /* copy word2 */
          word2[j++] = buffer[i++];
        word2[j] = 0;
}

char *basename_of(filename)
char *filename;
{
        /** returns just the information to the right of all the directory
            slashes in the given filename, or the filename if no slashes! **/

        register int i;

        for (i=strlen(filename)-1; i>0 && filename[i] != '/' &&
             filename[i] != ':'; i--)
           /** zoom backwards through the filename **/ ;

        if (i <= 0)     /* no directories specified, return NULL */
          return( (char *) filename );

        return( (char *) filename + i + 1);
}

usage()
{
        fprintf(stderr, "\nUsage: cget host:remotefile {local}\n\n");
        fprintf(stderr, "If you omit the ':remotefile' portion, then fget will");
	fprintf(stderr, " produce a listing of the\n");
        fprintf(stderr, "files on the remote system. To specify a particular");
	fprintf(stderr, " directory on the\n");
        fprintf(stderr, "remote system, replace 'local' with that ");
	fprintf(stderr, "directory name. For example,\n");
        fprintf(stderr,
"the command 'cget ftp.kernel.org /pub' will list the contents of the /pub\n");
        fprintf(stderr,
"directory on that machine. Copy a file from the remote system to the local\n");
	fprintf(stderr, 
"system with 'cget ftp.kernel.org:README' or rename it as you go by using\n");
	fprintf(stderr,
"'cget ftp.kernel.org:README new.readme'. To display a file directly on\n");
	fprintf(stderr,
"the screen, use '-' as the value for local.\n\n");
        exit(1);
}
