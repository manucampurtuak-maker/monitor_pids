FROM php:8.2-apache

# Hapus semua MPM yang bentrok
RUN rm -f /etc/apache2/mods-enabled/mpm_event.load
RUN rm -f /etc/apache2/mods-enabled/mpm_event.conf
RUN rm -f /etc/apache2/mods-enabled/mpm_worker.load
RUN rm -f /etc/apache2/mods-enabled/mpm_worker.conf

# Aktifkan prefork
RUN a2enmod mpm_prefork

# Install ekstensi PHP
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy project
COPY . /var/www/html/

# Permission
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80