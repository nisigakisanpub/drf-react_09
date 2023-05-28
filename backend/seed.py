from  todo.models import Todo

o_todo1=Todo(title="TODO1のタイトル",description="TODO1の説明",completed=False)
o_todo2=Todo(title="TODO2のタイトル",description="TODO2の説明",completed=False)

o_todo1.save()
o_todo2.save()

