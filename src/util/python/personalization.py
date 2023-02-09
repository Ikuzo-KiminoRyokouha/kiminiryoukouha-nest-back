import os
import json
import sys
import pandas
import getDestinationInfo
from surprise import Dataset, Reader, SVD,accuracy
from surprise.model_selection import cross_validate, train_test_split
from surprise.dataset import DatasetAutoFolds

currentPath = os.getcwd()

userId = json.loads(sys.argv[1])['userId']
start = json.loads(sys.argv[2])['start']
end =  json.loads(sys.argv[3])['end']
tag =  json.loads(sys.argv[4])['tag']
planId = json.loads(sys.argv[5])['planId']

r_cols = ['userId', 'destinationId' , 'rating', 'createAt']
ratings = pandas.read_csv(currentPath+'/pandas_output.csv',
                         names=r_cols,
                         sep=',',
                         encoding='latin-1')
reader = Reader( sep=',', rating_scale=(0, 5))

data_folds = DatasetAutoFolds(ratings_file=currentPath+'/pandas_output.csv', reader=reader)
 
#전체 데이터를 학습데이터로 생성함.
trainset =data_folds.build_full_trainset()
 
 
algo = SVD(n_epochs=20, n_factors=50, random_state=0)
algo.fit(trainset)
 
 
# 여행지에 대한 상세 속성 정보 DataFrame로딩
destinations = pandas.read_csv(currentPath+'/pandas_destination_output.csv').values.tolist()
selectByTagDestination = []
for destination in destinations:
    if(destination[3] in tag):
        selectByTagDestination.append(destination)
destinations = pandas.DataFrame(selectByTagDestination,columns=['id','title','createAt', 'cat3'])


def getRMSE():
    data = Dataset.load_from_df(ratings[['userId','destinationId','rating']],reader)
    trainset, testset = train_test_split(data, test_size=0.25)

    algo = SVD(n_factors=50 , random_state=0)

    algo.fit(trainset)
    predictions = algo.test(testset)
    accuracy.rmse(predictions)
    
    
def getUnclearDestination(ratings, destinations, userId):
    #입력값으로 들어온 userId에 해당하는 사용자가 평점을 매긴 모든 여행지를 리스트로 생성
    clear_destination = ratings[ratings['userId']== userId]['destinationId'].tolist()
     
    # 모든 여행지들의 id를 리스트로 생성.
    total_destinations = destinations['id'].tolist()
    # 모든 여행지들 중 이미 평점을 매긴 여행지를 제외하여 리스트로 생성
    unclear_destination= [destination for destination in total_destinations if destination not in clear_destination]
    # print('평점 매긴 여행지 수:',len(clear_destination), '추천대상 여행지 수:',len(unclear_destination), \
    #       '전체 여행지 수 :',len(total_destinations))
     
    return unclear_destination

def recommDestinationBySurprise(algo, userId, unclear_destination, start,end):
    # 알고리즘 객체의 predict() 메서드를 평점이 없는 여행지에 반복 수행한 후 결과를 list 객체로 저장
    predictions = [algo.predict(str(userId), str(destinationId)) for destinationId in unclear_destination]
    # predictions list 객체는 surprise의 Predictions 객체를 원소로 가지고 있음.
    # 이를 est 값으로 정렬하기 위해서 아래의 sortkey_est 함수를 정의함.
    # sortkey_est 함수는 list 객체의 sort() 함수의 키 값으로 사용되어 정렬 수행.
    def sortkey_est(pred):
        return pred.est
     
    # sortkey_est( ) 반환값의 내림 차순으로 정렬 수행하고 top_n개의 최상위 값 추출.
    predictions.sort(key=sortkey_est, reverse=True)
    top_predictions= predictions[start:end]
    # top_n으로 추출된 여행지의 정보 추출. 여행지 아이디, 추천 예상 평점, 제목 추출
    top_destination_ids = [ int(pred.iid) for pred in top_predictions]
    top_destinaiton_rating = [ pred.est for pred in top_predictions]
    # top_destination_titles = destinations[destinations.id.isin(top_destination_ids)]['title']
    top_destination_preds = [ (id,  rating) for id, rating in zip(top_destination_ids, top_destinaiton_rating)]
     
    return top_destination_preds



def deletePlanDestination( getPlanDestination , unclearDestination ):
    for destination in getPlanDestination:
        if(destination['destinationId'] in unclearDestination ):
            unclearDestination.remove(destination['destinationId'])

    return unclearDestination
  

unclear_destination = getUnclearDestination(ratings, destinations, userId)
delete_plan_destination = deletePlanDestination(getDestinationInfo.getPlanDestination(planId),unclear_destination)
top_destination_preds = recommDestinationBySurprise(algo, userId, delete_plan_destination,start, end)
for top_destination in top_destination_preds:
    print(json.dumps(top_destination))
