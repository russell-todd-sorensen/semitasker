--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.3

-- Started on 2016-10-17 14:44:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 606 (class 1259 OID 220294)
-- Name: hom_vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE hom_vehicles (
    vehicle_id integer NOT NULL,
    hom_id character varying(15) NOT NULL,
    vehicle_description character varying(127) NOT NULL,
    vehicle_color character varying(31),
    vehicle_license character varying(31) NOT NULL,
    vehicle_location character varying(31) NOT NULL,
    vehicle_vin character varying(63) NOT NULL,
    vehicle_year character(4) NOT NULL,
    vehicle_make character varying(31) NOT NULL,
    vehicle_model character varying(31) NOT NULL,
    vehicle_reg_expiration date NOT NULL,
    vehicle_total_fees numeric(5,2) DEFAULT 0.00 NOT NULL
);


ALTER TABLE hom_vehicles OWNER TO postgres;

--
-- TOC entry 4319 (class 0 OID 0)
-- Dependencies: 606
-- Name: COLUMN hom_vehicles.vehicle_color; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN hom_vehicles.vehicle_color IS 'Color of the vehicle.';


--
-- TOC entry 4314 (class 0 OID 220294)
-- Dependencies: 606
-- Data for Name: hom_vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (10, 'HOMV-10', '1998 Dodge Ram Van', 'AXB2946', 'Israel House', '2B5WB35Z2WK158479', '1998', 'Dodge', 'Ram Van SW', '2016-09-04', 323.78, 'Dark Green');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (11, 'HOMV-11', '1993 Dodge Ram Van', 'AZE4066', 'Paul House', '2B7KB31Z2PK534286', '1993', 'Dodge ', 'Ram Van SW', '2017-03-23', 405.25, 'Blue & White');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (12, 'HOMV-12', '2002 Chrysler 300', 'AZJ1032', 'Pastor James', '2C3AE66G32H165685', '2002', 'Chrysler', '300 M4D Sedan', '2016-01-01', 0.00, 'Dark Blue');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (14, 'HOMV-14', '1999 Dodge Ram Van', 'C27935G', 'Joshua House', '2B5WB35Z7XK558555', '1999', 'Dodge', 'Ram Van SW', '2017-06-23', 516.05, 'Maroon');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (15, 'HOMV-15', '1998 Dodge Caravan', 'C27935G', 'Spokane', '1B4GT54L0WB639206', '1998', 'Dodge', 'Caravan ', '2017-08-02', 409.50, 'White');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (16, 'HOMV-16', '1992 Dodge Ram Van', 'BCJ8723', 'Joshua House', '2B5WB35Z8NK130281', '1992', 'Dodge ', 'Ram Van SW', '2017-10-07', 288.44, 'Silver');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (18, 'HOMV-18', '1994 Jaguar XJ64D Sedan', 'BAL0328', 'Marco Arredondo', 'SAJHX1742RC703903', '1994', 'Jaguar', 'XJ64D Sedan', '2016-07-12', 0.00, 'Gold');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (2, 'HOMV-2', '2001 Dodge Dakota Sport Quadcab', 'C70579B', 'Pastor Lon', '1B7HL2ANX1S312929', '2001', 'Dodge', 'Dakota Pickup', '2016-09-26', 82.00, 'White');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (4, 'HOMV-4', '1994 Dodge Ram Van', 'AQR6344', 'Barnabas House', '2B7KB31Z5RK584568', '1994', 'Dodge', 'Ram Van', '2017-04-15', 103.75, 'Burgundy');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (3, 'HOMV-3', '1991 Toyota Previa LE', 'AHE7748', 'Joshua House', 'JT3AC22S2M0010190', '1991', 'Toyota', 'Previa SW', '2017-06-03', 94.75, 'White');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (5, 'HOMV-5', '1993 Ford E350 High Cube Van', 'B88860Y', 'Joshua House', '1FDKE37G6PHA54991', '1993', 'Ford', 'Cube Van', '2016-08-28', 91.00, 'Yellow');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (6, 'HOMV-6', '1998 Chevrolet Astro Van', 'AST7704', '1 Timothy House', '1GNDM19W2WB165863', '1998', 'Chevrolet', 'Astro Van', '2016-10-23', 84.75, 'Green');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (7, 'HOMV-7', '1998 Ford Windstar', 'ARE8639', 'John House', '2FMDA5140WBB59701', '1998', 'Ford', 'Windstar', '2017-06-04', 94.75, 'Gold');
INSERT INTO hom_vehicles (vehicle_id, hom_id, vehicle_description, vehicle_license, vehicle_location, vehicle_vin, vehicle_year, vehicle_make, vehicle_model, vehicle_reg_expiration, vehicle_total_fees, vehicle_color) VALUES (9, 'HOMV-9', '1993 Chevrolet Astro Van', 'AFK6999', 'Mark House', '1GNDM19W5PB211820', '1993', 'Chevrolet', 'Astro Van', '2016-01-01', 0.00, 'Grey');


--
-- TOC entry 4055 (class 2606 OID 220301)
-- Name: hom_vehicles_hom_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY hom_vehicles
    ADD CONSTRAINT hom_vehicles_hom_id_key UNIQUE (hom_id);


--
-- TOC entry 4057 (class 2606 OID 220299)
-- Name: hom_vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY hom_vehicles
    ADD CONSTRAINT hom_vehicles_pkey PRIMARY KEY (vehicle_id);


-- Completed on 2016-10-17 14:44:39

--
-- PostgreSQL database dump complete
--

