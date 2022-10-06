# get xs
get-users:
	http get http://localhost:6006/api/v1/users/

get-posts:
	http get http://localhost:6006/api/v1/posts/

get-comments:
	http get http://localhost:6006/api/v1/comments/

# get x
get-user:
	http get http://localhost:6006/api/v1/users/633a13053d4186151cb9c507/

get-post:
	http get http://localhost:6006/api/v1/posts/633a13903d4186151cb9c509/

get-comment:
	http get http://localhost:6006/api/v1/comments/633a13e33d4186151cb9c50c/

# post x
post-user:
	http post http://localhost:6006/api/v1/users/ name="just created name" email="just_created_email@gmail.com" password="just-created-password"

post-post:
	http post http://localhost:6006/api/v1/posts/ title="just created title" body="just created" user="633a13053d4186151cb9c507"
	
post-comment:
	http post http://localhost:6006/api/v1/comments/ text="just created text" post="633a13903d4186151cb9c509" user="633a13053d4186151cb9c507"


# errors
bad-id-get-users:
	http get http://localhost:6006/api/v1/users/6334fc4e2cf9c9051a90d6f9d
