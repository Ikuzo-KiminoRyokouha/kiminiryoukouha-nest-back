import os
import pymysql
# pip install pymysql
conn = pymysql.connect(host=os.environ['DB_HOST'],
                        user=os.environ['DB_USERNAME'], 
                        password=os.environ['DB_PASSWORD'], 
                        db='ikuzo',
                        charset='utf8'
                        )

