
#
# $Header$
#
# nsunixodbc --
#
#      UNIXODBC ODBC database driver.  Very similar to nsodbc but for Unix.
#


NSHOME    =  ../aolserver

ifndef UNIXODBC
all:
	@echo "** "
	@echo "** UNIXODBC variable not set."
	@echo "** nsunixodbc.so will not be built."
	@echo "** "
install:   all
clean:
	$(RM) *.so *.o *.a *~ TAGS core so_locations
clobber:   clean
distclean: clean
else

#
# Module name
#
MOD       =  nu.so

#
# Objects to build.
#
OBJS      =  nu.o

#
# Header files
#
HDRS      =  

#
# Extra libraries
#
MODLIBS   =  -L$(UNIXODBC)/lib -lodbc

#
# Extra compiler flags
#
CFLAGS    =  -I$(UNIXODBC)/include


include $(NSHOME)/include/Makefile.module

endif
