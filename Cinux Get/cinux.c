#include <stdio.h>
#include <curl/curl.h>
#include <curl/types.h>
#include <curl/easy.h>
#include <string.h>

size_t write_data(void *ptr, size_t size, size_t nmemb, FILE *stream)
{
   static int first_time=1;
   char outfilename[FILENAME_MAX] = "C:\\bbb.txt";
   static FILE *outfile;
   size_t written;
   
   if (first_time)
   {
      first_time = 0;
      outfile = fopen(outfilename,"wb");
      if (outfile == NULL)
         return -1;
      fprintf(stderr,"The body is <%s>\n",outfilename);
   }
   written = fwrite(ptr,size,nmemb,outfile);
   return written;
}

int main(void)
{
   CURL *curl;
   FILE *fp;
   CURLcode res;
   char *url = "http://localhost/aaa.txt";
   curl = curl_easy_init();
   if(curl)
   {
      curl_easy_setopt(curl, CURLOPT_URL, "http://localhost/aaa.txt");
      curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
      curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
      res = curl_easy_perform(curl);
      /* always cleanup */
      curl_easy_cleanup(curl);
   }
   return 0;
}
