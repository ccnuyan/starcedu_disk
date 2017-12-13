    git pull
    docker rm -f ss001
    docker rmi -f syncollege-site:001
    docker build -t syncollege-site:001 .
    docker run -d --name ss001 -p 28000:18000 syncollege-site:001
    docker logs ss001