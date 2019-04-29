kill $(ps aux | grep 'lt' | awk '{print $2}')
lt --port 8080 --subdomain travelyay &