##### 权限说明

<table style="font-size:3px">
	<tr>
	    <td rowspan="9">ReadOnly</td>
	    <td>SELECT</td>
	    <td>LOCK TABLES</td>
	    <td>SHOW VIEW</td>
	    <td>PROCESS</td>
	    <td>REPLICATION SLAVE</td>
	</tr>
	<tr>
	    <td>REPLICATION CLIENT</td>
	    <td></td>
	    <td></td>
	    <td></td>
	    <td></td>
	</tr>
</table>

<table style="font-size:3px">
	<tr>
	    <td rowspan="9">ReadWrite</td>
	    <td>SELECT</td>
	    <td>INSERT</td>
	    <td>UPDATE</td>
	    <td>DELETE</td>
	    <td>CREATE</td>
	</tr>
	<tr>
	    <td>DROP</td>
	    <td>REFERENCES</td>
	    <td>INDEX</td>
	    <td>ALTER</td>
	    <td>CREATE TEMPORARY TABLES</td>
	</tr>
	<tr>
	    <td>LOCK TABLES</td>
	    <td>EXECUTE</td>
	    <td>CREATE VIEW</td>
	    <td>SHOW VIEW</td>
	    <td>CREATE ROUTINE</td>
	</tr>
	<tr>
	    <td>ALTER ROUTINE</td>
	    <td>EVENT</td>
	    <td>TRIGGER</td>
	    <td>PROCESS</td>
	    <td>REPLICATION SLAVE</td>
	</tr>
	<tr>
	    <td>REPLICATION CLIENT</td>
	    <td></td>
	    <td></td>
	    <td></td>
	    <td></td>
	</tr>
</table>

<table style="font-size:3px">
	<tr>
	    <td rowspan="9">DDLOnly</td>
	    <td>CREATE</td>
	    <td>DROP</td>
	    <td>INDEX</td>
	    <td>ALTER</td>
	    <td>CREATE TEMPORARY TABLES</td>
	</tr>
	<tr>
	    <td>LOCK TABLES</td>
	    <td>CREATE VIEW</td>
	    <td>SHOW VIEW</td>
	    <td>CREATE ROUTINE</td>
	    <td>ALTER ROUTINE</td>
	</tr>
	<tr>
	    <td>PROCESS</td>
	    <td>REPLICATION SLAVE</td>
	    <td>REPLICATION CLIENT</td>
	    <td></td>
	    <td></td>
	</tr>
</table>

<table style="font-size:3px">
	<tr>
	    <td rowspan="9">DMLOnly</td>
	    <td>SELECT</td>
	    <td>INSERT</td>
	    <td>UPDATE</td>
	    <td>DELETE</td>
	    <td>CREATE TEMPORARY TABLES</td>
	</tr>
	<tr>
	    <td>LOCK TABLES</td>
	    <td>EXECUTE</td>
	    <td>SHOW VIEW</td>
	    <td>EVENT</td>
	    <td>TRIGGER</td>
	</tr>
	<tr>
	    <td>PROCESS</td>
	    <td>REPLICATION SLAVE</td>
	    <td>REPLICATION CLIENT</td>
	    <td></td>
	    <td></td>
	</tr>
</table>