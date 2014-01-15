#!/bin/bash
# author: wangkai
# date: 2014-01-15

# os: ubuntu

while true;
do
    echo -n "Please Enter Hostname:"
    read hostname
    if [[ -z hostname ]]; then
        echo "hostname is NULL. Enter again."
        continue
    fi
    echo -n "hostname is $hostname (Y|n):"
    read confirm
    if [[ -z $confirm || $confirm == 'Y' || $confirm == 'y' ]]; then
        echo -n "Please Enter ZabbixServer IP:"
        read zabbixserver_ip
        echo -n "Please Enter SaltMaster IP:"
        read saltmaster_ip
        echo -n "Please Enter PuppetMaster IP:"
        read puppetmaster_ip
        echo "zabbixserver ip: $zabbixserver_ip"
        echo "saltmaster ip: $saltmaster_ip"
        echo "puppetmaster ip: $puppetmaster_ip"
        echo -n "Confirm Information (Y|n)"
        read confirm
        if [[ -z $confirm || $confirm == 'Y' || $confirm == 'y' ]]; then
            break
        else
            continue
        fi
    else
        echo "Enter again."
        continue
    fi
done

#/etc/hostname
echo $hostname > /etc/hostname
hostname -F /etc/hostname
echo "--- /etc/hostname completed."

#/etc/hosts
sed -i "1i\127.0.1.1 $hostname" /etc/hosts

sed -i "/zabbixserver/d" /etc/hosts
echo "$zabbixserver_ip zabbixserver" >> /etc/hosts

sed -i "/salt/d" /etc/hosts
echo "$saltmaster_ip salt" >> /etc/hosts

sed -i "/puppetmaster/d" /etc/hosts
echo "$puppetmaster_ip puppetmaster" >> /etc/hosts
echo "--- /etc/hosts completed."

#/etc/localtime
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
echo "--- /etc/localtime completed"

#/etc/init/control-alt-delete.conf
sed -i 's/^exec shutdown/#exec shutdown/g' /etc/init/control-alt-delete.conf
echo "--- /etc/init/control-alt-delete completed."

#/etc/profile.d/tmout.sh
cat > /etc/profile.d/tmout.sh << EOF
TMOUT=900
readonly TMOUT
export TMOUT
EOF

#/etc/profile.d/language.sh
cat > /etc/profile.d/language.sh << EOF
LC_ALL='C'
readonly LC_ALL
export LC_ALL
EOF

#/etc/sysctl.conf
cat > /etc/sysctl.conf << EOF
kernel.unknown_nmi_panic = 1
kernel.sysrq = 1
fs.file-max = 65536

net.netfilter.nf_conntrack_max = 1000000
net.ipv4.netfilter.ip_conntrack_max = 65536
net.ipv4.netfilter.ip_conntrack_tcp_timeout_established = 180
net.ipv4.ip_local_port_range = 2048 65000

net.ipv4.tcp_max_tw_buckets = 6000
net.ipv4.tcp_tw_recycle = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_syncookies = 1

net.core.somaxconn = 262144
net.core.netdev_max_backlog = 262144

net.ipv4.tcp_max_orphans = 262144
net.ipv4.tcp_max_syn_backlog = 262144
net.ipv4.tcp_synack_retries = 1
net.ipv4.tcp_syn_retries = 1
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_timestamps = 0

EOF

#/etc/security/limits.conf
cat > /etc/security/limits.conf << EOF
root hard nofile 65535
root soft nofile 65535
qboxserver hard nofile 65535
qboxserver soft nofile 65535
EOF

#/etc/sudoers
sed -i "/.*zabbix.*/d" /etc/sudoers; echo "zabbix ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers; grep -n zabbix /etc/sudoers

#salt-minion
echo deb http://ppa.launchpad.net/saltstack/salt/ubuntu `lsb_release -sc` main | sudo tee /etc/apt/sources.list.d/saltstack.list
wget -q -O- "http://keyserver.ubuntu.com:11371/pks/lookup?op=get&search=0x4759FA960E27C0A6" | sudo apt-key add -
sudo apt-get update
sudo apt-get install salt-minion

#/etc/ssh/sshd_config
#sed -i "/.*PasswordAuthentication.*/d" /etc/ssh/sshd_config
#echo "PasswordAuthentication no" >> /etc/ssh/sshd_config
#/etc/init.d/ssh reload
