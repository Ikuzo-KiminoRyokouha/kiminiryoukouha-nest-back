import pandas
import accessDatabase


def dataToCSV():
    conn = accessDatabase.conn
    selectRatingSql = 'SELECT userId, destinationId,rating , createdAt FROM rating'
    selectDestinationSql = 'SELECT id , title , createdAT, cat3 FROM destination '
    rating = pandas.read_sql_query(selectRatingSql,conn)
    destination = pandas.read_sql_query(selectDestinationSql,conn)
    rating.to_csv(r'pandas_output.csv',index=False ,header=False)
    destination.to_csv(r'pandas_destination_output.csv',index=False )

    conn.close()
print('reset rating data and ')
dataToCSV()
