import uuid

def create_avatar_name(instance, filename):
    """
    Create and return hash name for user uploaded avatar files.
    """
    extension = filename.split('.')[-1]
    hashed_file_name = f'{uuid.uuid4()}.{extension}'
    return f'avatars/{hashed_file_name}'
