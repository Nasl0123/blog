#clase para crear un post nuevo, depende del objeto Post
# -*- coding: utf-8 -*-
import handler
from post import Post
from user import User
import hashlib
import time
from google.appengine.ext import db
from google.appengine.api import memcache

class Newpost(handler.Handler):
    def render_front(self,title = '',post = '',error = '',user='',recent_msg=None):
        self.render('ascii.html',user=user,title=title,post=post,error=error,pagename='Postear',recent_msg=recent_msg)
    def get(self):
        user = None
        if self.get_cookie_user(self.request.cookies.get('user_id'))[0]:
            user = self.get_data('User')
            user = user.get(int(self.request.cookies.get('user_id').split('|')[0]))
            messages = self.GetMessages(persona=user)
            if not user.banned_from_posting:
                self.render_front(user=user,recent_msg=messages)
            else:
                self.redirect('/posts/news')
        else:
            self.redirect('/signup')
    
    def post(self,error=''):
        user = self.get_data('User')
        user = user.get(int(self.request.cookies.get('user_id').split('|')[0]))
        topic = self.request.get('topic')
        title = self.request.get('subject')
        post = self.request.get('content')
        submitter = self.get_cookie_user(self.request.cookies.get('user_id'))[1]
        messages = self.GetMessages(persona=submitter)
        if user and not user.banned_from_posting:
            if title and post and topic:

                a = Post(topic= topic, title=title,post=post,submitter=submitter.user_id,modificable="False",comments=0,visible=True,state=False)

                a.created_str = str(a.created)
                a.created_str = a.created_str[0:16]
                a.put()
                self.get_data('Post','dict',a.key().id(),a,actualizar=True) 
                self.redirect('/'+str(a.key().id()))
            else:
                error = u'Título y contenido y tema requeridos'
            user = None
            if self.get_cookie_user(self.request.cookies.get('user_id'))[0]:
                user = self.get_data('User')
                user = user.get(int(self.request.cookies.get('user_id').split('|')[0]))
                self.render_front(title,post,error,user,messages)
            else:
                self.redirect('/signup')
        else:
            self.redirect('/')
            
