username="Notarus"
passwd="jALVkxDB4RUGy3xv"
dbname="local_library"

uri="mongodb+srv://$username:$passwd<password>@cluster0.9qmfq.mongodb.net/$dbname?retryWrites=true&w=majority"

heroku config:set MONGODB_URI=$uri
