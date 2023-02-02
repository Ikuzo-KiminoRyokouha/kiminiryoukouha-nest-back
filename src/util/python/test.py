import os
import pymysql
import pandas
# pip install pymysql
conn = pymysql.connect(host=os.environ['DB_HOST'],
                        user=os.environ['DB_USERNAME'], 
                        password=os.environ['DB_PASSWORD'], 
                        db='ikuzo',
                        charset='utf8'
                        )
# 커서(cursor)는 데이터베이스에 SQL 문을 실행하거나 실행된 결과를 돌려받는 통로
cur = conn.cursor()
selectRatingSql = '''SELECT rating.id, userId, destinationId,rating , user.nickname ,destination.title
                    FROM rating 
                    JOIN user 
                    ON rating.userId = user.id 
                    JOIN destination 
                    ON destinationId = destination.id
                    '''

result = pandas.read_sql_query(selectRatingSql,conn)
result.to_csv(r'pandas_output.csv',index=False)
print(result)

conn.close()