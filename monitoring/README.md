Containers to monitor every dockers from a project.  
First build with node_exporter and prometheus only, but not accurate because node_exporter get host's system datas (cpu, ram, disk, network...) and not containers datas.  
Second build with CAdvisor to get accurate datas about each containers on grafana. Still keep node_exporter for prometheus's dashboard.  
CAdvisor get datas from volumes given in compose file.  
Then prometheus scrape CAdvisor metrics endpoint.  
Finally Grafana get datas from Prometheus to display on dashboard.  
Integrated alerts in Prometheus to easily monitor container status.  
