#
# Makefile for the FGET utility

TARGET=cget
OBJ=cget.o utils.o

CFLAGS=
CC=/usr/bin/cc

$(TARGET): $(OBJ) cget.h
	$(CC) $(CFLAGS) $(OBJ) -o $(TARGET)

fget.o: cget.c cget.h
	$(CC) $(CFLAGS) -c fget.c

utils.o: utils.c cget.h
	$(CC) $(CFLAGS) -c utils.c
