#esta es la clase que muestra los posts

import newpost
from user import User
import hashlib
from google.appengine.ext import db

class Page(newpost.Newpost):
    def get(self):
        user = self.request.cookies.get('user_id')
        online = False
        if user and hashlib.sha256(user.split('|')[0]).hexdigest() == user.split('|')[1]:
            user = user.split('|')[0]
            user = User.get_by_id(int(user))
            if user:
                user = user.user_id
        else:
        	user = None
        posts = db.GqlQuery('select * from Post order by created desc')
        posts = list(posts)
        for e in posts:
            if e.submitter == user:
                e.submitter = "ti"
            else:
                submitter = db.GqlQuery("select * from User where user_id='"+e.submitter+"'")
                submitter = list(submitter)
                if len(submitter) < 1:
                    e.submitter = e.submitter+"|False"
                else:
                    e.submitter = db.GqlQuery("select * from User where user_id='"+e.submitter+"'").fetch(1)[0].displayName+"|True"
        self.render('page.html',pagename='Pagina principal',posts=posts,user=user) 
