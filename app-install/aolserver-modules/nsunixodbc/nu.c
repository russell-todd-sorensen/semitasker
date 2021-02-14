/*
 * The contents of this file are subject to the AOLserver Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://aolserver.com/.
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is AOLserver Code and related documentation
 * distributed by AOL.
 * 
 * The Initial Developer of the Original Code is America Online,
 * Inc. Portions created by AOL are Copyright (C) 1999 America Online,
 * Inc. All Rights Reserved.
 *
 * Alternatively, the contents of this file may be used under the terms
 * of the GNU General Public License (the "GPL"), in which case the
 * provisions of GPL are applicable instead of those above.  If you wish
 * to allow use of your version of this file only under the terms of the
 * GPL and not to allow others to use your version of this file under the
 * License, indicate your decision by deleting the provisions above and
 * replace them with the notice and other provisions required by the GPL.
 * If you do not delete the provisions above, a recipient may use your
 * version of this file under either the License or the GPL.
 */

/* 
 * nsunixodbc.c --
 *
 *	AOLserver Unix ODBC driver works with unixodbc:
 *      http://www.unixodbc.org/.
 *
 */


static char rcsid[] = "$Id$";

/* AOLserver header files */
#include "ns.h"
#include "nsdb.h"

/* UnixODBC SQL API headers */
#define ODBCVER 0x0351
#include "sqlext.h"

/* Common system headers */
#include <ctype.h>
#include <string.h>
#include <assert.h>

#define ODBCLogHenv(rc,handle,henv) (ODBCLog(rc,handle,henv,0,0))
#define ODBCLogHdbc(rc,handle,hdbc) (ODBCLog(rc,handle,0,hdbc,0))
#define ODBCLogHstmt(rc,handle,hstmt) (ODBCLog(rc,handle,0,0,hstmt))
#define RC_SUCCESSFUL(rc) (!((rc)>>1))
#define TOLOWER(str, i) for(i = str; *i; i++) \
                         *i = (char)tolower((int)*i)

#define MAX_DATA 8192
#define MAX_ERROR_MSG 500
#define MAX_IDENTIFIER 256

#define DRIVER_NAME "UNIXODBC"

#define NS_SQL_BIGINT        "bigint"
#define NS_SQL_BINARY        "binary"
#define NS_SQL_BIT           "bit"
#define NS_SQL_CHAR          "char"
#define NS_SQL_DATE          "date"
#define NS_SQL_DECIMAL       "decimal"
#define NS_SQL_DOUBLE        "double"
#define NS_SQL_FLOAT         "float"
#define NS_SQL_INTEGER       "integer"
#define NS_SQL_LONGVARBINARY "longvarbinary"
#define NS_SQL_LONGVARCHAR   "longvarchar"
#define NS_SQL_NUMERIC       "numeric"
#define NS_SQL_REAL          "real"
#define NS_SQL_SMALLINT      "smallint"
#define NS_SQL_TIME          "time"
#define NS_SQL_TIMESTAMP     "timestamp"
#define NS_SQL_TINYINT       "tinyint"
#define NS_SQL_VARBINARY     "varbinary"
#define NS_SQL_VARCHAR       "varchar"

static char    *Ns_ODBCName(void);
static char    *Ns_ODBCDbType(void);
static int      Ns_ODBCServerInit(char *hServer, char *hModule, char *hDriver);
static int      Ns_ODBCOpenDb(Ns_DbHandle *handle);
static int      Ns_ODBCCloseDb(Ns_DbHandle *handle);
static int      Ns_ODBCDML(Ns_DbHandle *handle, char *sql);
static Ns_Set  *Ns_ODBCSelect(Ns_DbHandle *handle, char *sql);
static int      Ns_ODBCGetRow(Ns_DbHandle *handle, Ns_Set *row);
static int      Ns_ODBCFlush(Ns_DbHandle *handle);
static int      Ns_ODBCCancel(Ns_DbHandle *handle);
static int      Ns_ODBCExec(Ns_DbHandle *handle, char *sql);
static Ns_Set  *Ns_ODBCBindRow(Ns_DbHandle *handle);

static HENV     odbcenv;
static int      Ns_ODBCShutdown(HENV henv);
static void     ODBCLog(SQLRETURN rc, Ns_DbHandle *handle, HENV henv, HDBC hdbc, HSTMT hstmt);
static char    *odbcName = DRIVER_NAME;


static Ns_DbProc odbcProcs[] = {
    {DbFn_Name, Ns_ODBCName},
    {DbFn_DbType, Ns_ODBCDbType},
    {DbFn_ServerInit, (void *) Ns_ODBCServerInit},
    {DbFn_OpenDb, Ns_ODBCOpenDb},
    {DbFn_CloseDb, Ns_ODBCCloseDb},
    {DbFn_DML, Ns_ODBCDML},
    {DbFn_Select, Ns_ODBCSelect},
    {DbFn_GetRow, Ns_ODBCGetRow},
    {DbFn_Flush, Ns_ODBCFlush},
    {DbFn_Cancel, Ns_ODBCCancel},
    {DbFn_Exec, (void *) Ns_ODBCExec},
    {DbFn_BindRow, (void *) Ns_ODBCBindRow},
    {0, NULL}
};


DllExport int   Ns_ModuleVersion = 1;
DllExport int   Ns_ModuleFlags = 0;
DllExport int
Ns_DbDriverInit(char *hDriver, char *configPath)
{
    SQLRETURN         rc;

    if (hDriver == NULL) {
        Ns_Log(Bug, "nsunixodbc:  NULL driver name.");
        return NS_ERROR;
    }
    if (Ns_DbRegisterDriver(hDriver, &(odbcProcs[0])) != NS_OK) {
        Ns_Log(Error, "nsunixodbc: could not register the %s driver",
	       DRIVER_NAME);
        return NS_ERROR;
    }
    rc = SQLAllocEnv(&odbcenv);
    if (rc != SQL_SUCCESS) {
        return NS_ERROR;
    }
    Ns_RegisterShutdown((Ns_Callback *) Ns_ODBCShutdown, odbcenv);
    return NS_OK;
}


static int
Ns_ODBCShutdown(HENV henv)
{
    SQLRETURN  rc;

    rc = SQLFreeEnv(henv);

    ODBCLog(rc, NULL, henv, 0, 0);

    if (RC_SUCCESSFUL(rc)) {
        return NS_OK;
    } else {
        return NS_ERROR;
    }
}

static char    *
Ns_ODBCName(void)
{
    return odbcName;
}


static char    *
Ns_ODBCDbType(void)
{
    return odbcName;
}

/*
 * Does both the SQLAllocConnect AND the SQLConnect
 * 
 */

static int
Ns_ODBCOpenDb(Ns_DbHandle *handle)
{
    HDBC            hdbc;
    SQLRETURN       rc;
    int             userlen, passwordlen;

    assert(handle != NULL);
    assert(handle->datasource != NULL);

    rc = SQLAllocConnect(odbcenv, &hdbc);
    ODBCLogHenv(rc, NULL, odbcenv);

    if (!RC_SUCCESSFUL(rc)) {
        return NS_ERROR;
    }
    if (handle->user != NULL) {
        userlen = strlen(handle->user);
    } else {
        userlen = 0;
    }

    if (handle->password != NULL) {
        passwordlen = strlen(handle->password);
    } else {
        passwordlen = 0;
    }
    Ns_Log(Notice, "nsunixodbc: SQLConnect(%s, %s, %s)",
	   handle->datasource, handle->user == NULL ? "(null)" : handle->user,
	   handle->password == NULL ? "(null)" : handle->password);
    rc = SQLConnect(hdbc, handle->datasource,
		    (SQLSMALLINT) strlen(handle->datasource),
		    handle->user, (SWORD) userlen, handle->password,
		    (SWORD) passwordlen);
    ODBCLogHdbc(rc, NULL, hdbc);

    if (!RC_SUCCESSFUL(rc)) {
        return NS_ERROR;
    }
    handle->connection = (void *) hdbc;
    handle->connected = NS_TRUE;

    return NS_OK;
}

static int
Ns_ODBCCloseDb(Ns_DbHandle *handle)
{
    SQLRETURN         rc;

    rc = SQLDisconnect((HDBC) handle->connection);
    if (!RC_SUCCESSFUL(rc)) {
        return NS_ERROR;
    }
    rc = SQLFreeConnect((HDBC) handle->connection);
    if (!RC_SUCCESSFUL(rc)) {
        return NS_ERROR;
    }
    handle->connected = NS_FALSE;
    return NS_OK;
}

static int
Ns_ODBCDML(Ns_DbHandle *handle, char *sql)
{
    HSTMT           hstmt;
    SQLRETURN         rc;
    int             status;
    short	    numcols;

    assert(handle != NULL);
    assert(sql != NULL);

    status = NS_OK;

    rc = SQLAllocStmt((HDBC) handle->connection, &hstmt);
    ODBCLogHdbc(rc, handle, (HDBC) handle->connection);

    if (!RC_SUCCESSFUL(rc)) {
        return NS_ERROR;
    }
    rc = SQLExecDirect(hstmt, sql, SQL_NTS);
    ODBCLogHstmt(rc, handle, hstmt);

    if (RC_SUCCESSFUL(rc)) {
        rc = SQLNumResultCols(hstmt, &numcols);
	ODBCLogHstmt(rc, handle, hstmt);

	if (RC_SUCCESSFUL(rc)) {
	    /* DML statements do not return rows. */
	    if (numcols != 0) {
	        Ns_Log(Error, "nsunixodbc: dml query cannot return rows");
		status =  NS_ERROR;
	    }
	} else {
	    status = NS_ERROR;
	}
    } else {
        status = NS_ERROR;
    }

    rc = SQLFreeStmt(hstmt, SQL_DROP);

    if (!RC_SUCCESSFUL(rc)) {
        status = NS_ERROR;
    }
    return status;
}

static Ns_Set  *
Ns_ODBCSelect(Ns_DbHandle *handle, char *sql)
{
    HSTMT           hstmt;
    SQLRETURN         rc;
    Ns_Set         *row;
    short           i, numcols;
    char           *t;

    assert(handle != NULL);
    assert(sql != NULL);

    rc = SQLAllocStmt((HDBC) handle->connection, &hstmt);
    ODBCLogHdbc(rc, handle, (HDBC) handle->connection);

    if (!RC_SUCCESSFUL(rc)) {
        return NULL;
    }
    handle->statement = (void *) hstmt;
    handle->fetchingRows = 1;

    rc = SQLExecDirect(hstmt, sql, SQL_NTS);
    ODBCLogHstmt(rc, handle, hstmt);

    if (!RC_SUCCESSFUL(rc)) {
error:
        rc = SQLFreeStmt(hstmt, SQL_DROP);
        handle->statement = NULL;
        handle->fetchingRows = 0;
        return NULL;
    }
    rc = SQLNumResultCols(hstmt, &numcols);
    if (!RC_SUCCESSFUL(rc)) {
        goto error;
    }
    if (numcols == 0) {
        Ns_Log(Error, "nsunixodbc: query failed to return rows");
        goto error;
    }
    row = handle->row;

    for (i = 1; i <= numcols; i++) {
        char            colname[100];
        short           cbcolname;
        SWORD           sqltype, ibscale, nullable;
        UDWORD          cbcoldef;

        rc = SQLDescribeCol(hstmt, i, colname, sizeof(colname),
            &cbcolname, &sqltype, &cbcoldef, &ibscale, &nullable);
	TOLOWER(colname, t);
        ODBCLogHstmt(rc, handle, hstmt);
        if (!RC_SUCCESSFUL(rc)) {
            goto error;
        }
        Ns_SetPut(row, colname, NULL);
    }

    return row;

}

static int
Ns_ODBCGetRow(Ns_DbHandle *handle, Ns_Set *row)
{
    SQLRETURN         rc;
    short           i;
    HSTMT           hstmt;
    short           numcols;

    if (!handle->fetchingRows) {
        Ns_Log(Error, "nsunixodbc: no rows waiting to fetch");
        return NS_ERROR;
    }
    hstmt = (HSTMT) handle->statement;

    rc = SQLNumResultCols(hstmt, &numcols);
    ODBCLogHstmt(rc, handle, hstmt);

    if (!RC_SUCCESSFUL(rc)) {
error:
        rc = SQLFreeStmt(hstmt, SQL_DROP);
        handle->statement = NULL;
        handle->fetchingRows = 0;
        return NS_ERROR;
    }
    if (numcols != Ns_SetSize(row)) {
        Ns_Log(Error, "nsunixodbc: number of columns in row (%d)"
	       "not equal to number of columns in row fetched (%d)",
	       Ns_SetSize(row), numcols);
        goto error;
    }
    rc = SQLFetch(hstmt);
    ODBCLogHstmt(rc, handle, hstmt);

    if (rc == SQL_NO_DATA_FOUND) {
        rc = SQLFreeStmt(hstmt, SQL_DROP);
        handle->statement = NULL;
        handle->fetchingRows = 0;
        return NS_END_DATA;
    } else if (!RC_SUCCESSFUL(rc)) {
        goto error;
    }
    for (i = 1; i <= numcols; i++) {
        char            datum[MAX_DATA];
        SDWORD          cbvalue;

        rc = SQLGetData(hstmt, i, SQL_C_CHAR, datum, sizeof(datum), &cbvalue);
        ODBCLogHstmt(rc, handle, hstmt);
        if (!RC_SUCCESSFUL(rc)) {
            goto error;
        }
        if (cbvalue == SQL_NULL_DATA) {
            Ns_SetPutValue(row, i - 1, "");
        } else {
            Ns_SetPutValue(row, i - 1, datum);
        }
    }
    return NS_OK;
}

static int
Ns_ODBCFlush(Ns_DbHandle *handle)
{
    return Ns_ODBCCancel(handle);
}

static int
Ns_ODBCCancel(Ns_DbHandle *handle)
{
    if (handle->fetchingRows) {
        SQLRETURN         rc;
        HSTMT           hstmt;

        hstmt = (HSTMT) handle->statement;

        assert(hstmt != NULL);

        rc = SQLCancel(hstmt);
        ODBCLogHstmt(rc, handle, hstmt);
        if (!RC_SUCCESSFUL(rc)) {
            return NS_ERROR;
        } else {
            rc = SQLFreeStmt(hstmt, SQL_DROP);
            handle->statement = NULL;
            handle->fetchingRows = 0;
        }
    }
    return NS_OK;
}



static int
Ns_ODBCExec(Ns_DbHandle *handle, char *sql)
{
    HSTMT           hstmt;
    SQLRETURN         rc;
    int             status;
    short	    numcols;

    assert(handle != NULL);
    assert(sql != NULL);

    status = NS_OK;

    rc = SQLAllocStmt((HDBC) handle->connection, &hstmt);
    ODBCLogHdbc(rc, handle, (HDBC) handle->connection);

    if (!RC_SUCCESSFUL(rc)) {
        return NS_ERROR;
    }
    rc = SQLExecDirect(hstmt, sql, SQL_NTS);
    ODBCLogHstmt(rc, handle, hstmt);

    if (RC_SUCCESSFUL(rc)) {
        rc = SQLNumResultCols(hstmt, &numcols);
	ODBCLogHstmt(rc, handle, hstmt);

	if (RC_SUCCESSFUL(rc)) {
	    if (numcols != 0) {
	        handle->statement = (void *) hstmt;
		handle->fetchingRows = 1;
		status = NS_ROWS;
	    } else {
	        status = NS_DML;
	    }
	} else {
	    status = NS_ERROR;
	}
    } else {
        status = NS_ERROR;
    }

    /* 
     * Do not free the statement handle for queries which return
     * rows since it is used at a later time to fetch the rows.
     */
    if (status != NS_ROWS) {
        rc = SQLFreeStmt(hstmt, SQL_DROP);

        if (!RC_SUCCESSFUL(rc)) {
          status = NS_ERROR;
        }
    }
    return status;
}


static Ns_Set  *
Ns_ODBCBindRow(Ns_DbHandle *handle)
{
    HSTMT           hstmt;
    SQLRETURN         rc;
    Ns_Set         *row;
    short           i, numcols;
    char           *t;

    if (!handle->fetchingRows) {
        Ns_Log(Error, "nsunixodbc: no rows waiting to fetch");
        return NULL;
    }
    hstmt = (HSTMT) handle->statement;

    rc = SQLNumResultCols(hstmt, &numcols);
    if (!RC_SUCCESSFUL(rc)) {
error:
        rc = SQLFreeStmt(hstmt, SQL_DROP);
        handle->statement = NULL;
        handle->fetchingRows = 0;
	return NULL;
    }
    row = handle->row;

    for (i = 1; i <= numcols; i++) {
        char            colname[100];
        short           cbcolname;
        SWORD           sqltype, ibscale, nullable;
        UDWORD          cbcoldef;

        rc = SQLDescribeCol(hstmt, i, colname, sizeof(colname),
            &cbcolname, &sqltype, &cbcoldef, &ibscale, &nullable);
	TOLOWER(colname, t);
        ODBCLogHstmt(rc, handle, hstmt);
        if (!RC_SUCCESSFUL(rc)) {
            goto error;
        }
        Ns_SetPut(row, colname, NULL);
    }

    return row;
}


/*
 * ODBCCmd - This function implements the "ns_odbc" Tcl command installed
 * into each interpreter of each virtual server.  It provides access to
 * features specific to the ODBC driver.
 */

static int
ODBCCmd(ClientData dummy, Tcl_Interp *interp, int argc, char **argv)
{
    Ns_DbHandle    *handle;
    SQLRETURN       rc;
    char            buf[MAX_IDENTIFIER];
    /* Following syntax error */
    /* SWORD FAR       cbInfoValue; */
    SWORD           cbInfoValue;

    if (argc != 3) {
        Tcl_AppendResult(interp, "wrong # args: should be \"",
            argv[0], " cmd handle\"", NULL);
        return TCL_ERROR;
    }
    if (Ns_TclDbGetHandle(interp, argv[2], &handle) != TCL_OK) {
        return TCL_ERROR;
    }
    /* Make sure this is an ODBC handle before accessing handle->connection. */
    if (Ns_DbDriverName(handle) != odbcName) {
        Tcl_AppendResult(interp, "handle \"", argv[1], "\" is not of type \"",
            odbcName, "\"", NULL);
        return TCL_ERROR;
    }
    if (STREQ(argv[1], "dbmsname")) {
        rc = SQLGetInfo((HDBC) handle->connection, SQL_DBMS_NAME, buf, sizeof(buf), &cbInfoValue);
        ODBCLogHdbc(rc, handle, (HDBC) handle->connection);

        if (!RC_SUCCESSFUL(rc)) {
            Tcl_SetResult(interp, "Could not determine dbmsname", TCL_STATIC);
            return TCL_ERROR;
        }
        Tcl_SetResult(interp, buf, TCL_VOLATILE);
        return TCL_OK;
    } else if (STREQ(argv[1], "dbmsver")) {
        rc = SQLGetInfo((HDBC) handle->connection, SQL_DBMS_VER, buf, sizeof(buf), &cbInfoValue);
        ODBCLogHdbc(rc, handle, (HDBC) handle->connection);

        if (!RC_SUCCESSFUL(rc)) {
            Tcl_SetResult(interp, "Could not determine dbmsver", TCL_STATIC);
            return TCL_ERROR;
        }
        Tcl_SetResult(interp, buf, TCL_VOLATILE);
        return TCL_OK;
    } else if (STREQ(argv[1], "begintransaction") ) {
      rc = SQLSetConnectAttr( (HDBC) handle->connection, 
			      SQL_ATTR_AUTOCOMMIT,
			      (SQLPOINTER)SQL_AUTOCOMMIT_OFF,
			      0);
      ODBCLogHdbc(rc, handle, (HDBC) handle->connection);

      if (!RC_SUCCESSFUL(rc)) {
	Tcl_SetResult(interp, "Unable to begin transaction", TCL_STATIC);
	return TCL_ERROR;
      }
    } else if (STREQ(argv[1], "committransaction") ) {
      rc = SQLEndTran( SQL_HANDLE_DBC,
		       (HDBC) handle->connection, 
		       SQL_COMMIT);
      ODBCLogHdbc(rc, handle, (HDBC) handle->connection);

      if (!RC_SUCCESSFUL(rc)) {
	Tcl_SetResult(interp, "Unable to commit transaction", TCL_STATIC);
	return TCL_ERROR;
      }
    } else if (STREQ(argv[1], "rollbacktransaction") ) {
      rc = SQLEndTran( SQL_HANDLE_DBC,
		       (HDBC) handle->connection, 
		       SQL_ROLLBACK);
      ODBCLogHdbc(rc, handle, (HDBC) handle->connection);

      if (!RC_SUCCESSFUL(rc)) {
	Tcl_SetResult(interp, "Unable to rollback transaction", TCL_STATIC);
	return TCL_ERROR;
      }
    } else {
        Tcl_AppendResult(interp, "unknown command \"", argv[1],
            "\": should be dbmsname or dbmsver.", NULL);
        return TCL_ERROR;
    }
    return TCL_OK;
}


static int
Ns_ODBCInterpInit(Tcl_Interp *interp, void *ignored)
{
    Tcl_CreateCommand(interp, "ns_odbc", ODBCCmd, NULL, NULL);
    return NS_OK;
}


static int
Ns_ODBCServerInit(char *hServer, char *hModule, char *hDriver)
{
    return Ns_TclInitInterps(hServer, Ns_ODBCInterpInit, NULL);
}


static void
ODBCLog(SQLRETURN rc, Ns_DbHandle *handle, HENV henv, HDBC hdbc, HSTMT hstmt)
{
    Ns_LogSeverity  severity;

    if (rc == SQL_ERROR || rc == SQL_SUCCESS_WITH_INFO) {
        char            szSQLSTATE[6];
        SDWORD          nErr;
        char            msg[MAX_ERROR_MSG + 1];
        /* syntax error following */
        /* SWORD FAR       cbmsg; */
	SWORD           cbmsg;

        if (rc == SQL_SUCCESS_WITH_INFO) {
            severity = Warning;
        } else {
            severity = Error;
        }
        while (SQLError(henv, hdbc, hstmt, szSQLSTATE, &nErr, msg,
                sizeof(msg), &cbmsg) == SQL_SUCCESS) {

            Ns_Log(severity, "nsunixodbc: odbc message: "
		   "SQLSTATE = %s, Native err = %ld, msg = '%s'",
		   szSQLSTATE, nErr, msg);
            if (handle != NULL) {
                strcpy(handle->cExceptionCode, szSQLSTATE);
                Ns_DStringFree(&(handle->dsExceptionMsg));
                Ns_DStringAppend(&(handle->dsExceptionMsg), msg);
            }
        }
    }
}
