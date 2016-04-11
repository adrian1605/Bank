-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2014 at 12:48 PM
-- Server version: 5.6.20
-- PHP Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `socialnode`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
`id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL COMMENT 'Foreign key to the app id',
  `account_type` enum('login','connect') NOT NULL COMMENT 'The account type, should it be for login or for connect',
  `network_type` varchar(200) NOT NULL COMMENT 'Network types: facebook, google, twitter, linkedin',
  `network_id` varchar(200) NOT NULL COMMENT 'The user''s ID from the network (facebook_id, twitter_id, etc)',
  `user_id` int(11) DEFAULT NULL COMMENT 'Foreign key when an account is linked with a user.',
  `access_token` varchar(400) NOT NULL,
  `access_token_secret` varchar(200) DEFAULT NULL,
  `access_type` enum('user','page') NOT NULL,
  `access_expire` timestamp NULL DEFAULT NULL COMMENT 'A timestamp to when the access token will expire.',
  `login_token` varchar(200) DEFAULT NULL COMMENT 'This token is sent to the remote server so it can perform the login',
  `login_token_expire` timestamp NULL DEFAULT NULL COMMENT 'A timestamp to when the login token will expire.',
  `login_dt` timestamp NULL DEFAULT NULL,
  `user_data` longtext COMMENT 'A stringified JSON containing additional data for the account',
  `create_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `application_id`, `account_type`, `network_type`, `network_id`, `user_id`, `access_token`, `access_token_secret`, `access_type`, `access_expire`, `login_token`, `login_token_expire`, `login_dt`, `user_data`, `create_dt`) VALUES
(17, 1, 'connect', 'linkedin', 'RPJolZOraK', NULL, 'AQUB1PxwhKdQa76nYAvny1hKUfPw8BHMLyEInhIPqeeC2dgUjcTKeQzWEtfULw4JqmeCwUnplVV_Tt8DB4XcX8BIe3PTFucAgPV_N1qwcH26L5KCKNO5dXS6DU8PwYjX6ohp8PAGLrAAY0GJaxcrL_dqqGkqRIgVMGgcMb4V7h5Fn8U-_wY', NULL, 'user', '2014-12-29 11:19:10', 'ctdno9ad5daXkWrQyYhGBsOu8KwxfHmvSQGv9H1R', '2014-10-30 12:44:03', NULL, '{"network_id":"RPJolZOraK","name":"Tewstoz Testoz","image":"https://media.licdn.com/mpr/mprx/0_TOAnqYtsDk5Zfp4K_xlWqphX7Q-MipHK_sLdqpTkK_6epZ0rD43ssyzETHtb8Rdy8j1eRUPm_tBc","network_type":"linkedin","application_id":1,"account_type":"connect","access_type":"user","foreign_id":null}', '2014-10-30 11:44:03');

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE IF NOT EXISTS `applications` (
`id` int(10) NOT NULL,
  `code` varchar(20) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `code`) VALUES
(1, 'tru');

-- --------------------------------------------------------

--
-- Table structure for table `shares`
--

CREATE TABLE IF NOT EXISTS `shares` (
`id` int(11) NOT NULL,
  `social_id` varchar(100) NOT NULL COMMENT 'The ID generated by the network',
  `account_id` int(11) NOT NULL COMMENT 'Which account created this share',
  `payload` varchar(500) NOT NULL COMMENT 'The JSON that we used to create.',
  `url` varchar(200) DEFAULT NULL COMMENT 'Optional, if we used a URL to the share.'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `foreign_id` varchar(50) NOT NULL COMMENT 'The id field of the user in the external project.',
  `email` varchar(200) DEFAULT NULL,
  `create_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `application_id`, `foreign_id`, `email`, `create_dt`) VALUES
(5, 1, '1234', NULL, '2014-10-30 11:42:52');

-- --------------------------------------------------------

--
-- Table structure for table `users_accounts`
--

CREATE TABLE IF NOT EXISTS `users_accounts` (
  `user_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users_accounts`
--

INSERT INTO `users_accounts` (`user_id`, `account_id`) VALUES
(5, 17);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
 ADD PRIMARY KEY (`id`), ADD KEY `network_id` (`network_id`,`user_id`), ADD KEY `user_id` (`user_id`), ADD KEY `platform_id` (`application_id`), ADD KEY `login_token` (`login_token`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `shares`
--
ALTER TABLE `shares`
 ADD PRIMARY KEY (`id`), ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD KEY `platform_id` (`application_id`,`foreign_id`);

--
-- Indexes for table `users_accounts`
--
ALTER TABLE `users_accounts`
 ADD PRIMARY KEY (`user_id`,`account_id`), ADD KEY `account_id` (`account_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
MODIFY `id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `shares`
--
ALTER TABLE `shares`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `accounts_ibfk_2` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shares`
--
ALTER TABLE `shares`
ADD CONSTRAINT `shares_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users_accounts`
--
ALTER TABLE `users_accounts`
ADD CONSTRAINT `users_accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `users_accounts_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

INSERT INTO `applications` (`id`, `code`) VALUES
(1, 'tru');
