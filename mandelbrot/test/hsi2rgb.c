inline void HSI2RGB(double h, double s, double i, double* r, double* g, double* b)
{
	double x = i * (1 - s);
	if(h < 2 * M_PI / 3)
	{
		double y = i * (1 + (s * cos(h)) / (cos(M_PI / 3 - h)));
		double z = 3 * i - (x + y);
		*b = x; *r = y; *g = z;
	}
	else if(h < 4 * M_PI / 3)
	{
		double y = i * (1 + (s * cos(h - 2 * M_PI / 3)) / (cos(M_PI / 3 - (h  - 2 * M_PI / 3))));
		double z = 3 * i - (x + y);
		*r = x; *g = y; *b = z;
	}
	else
	{
		double y = i * (1 + (s * cos(h - 4 * M_PI / 3)) / (cos(M_PI / 3 - (h  - 4 * M_PI / 3))));
		double z = 3 * i - (x + y);
		*r = z; *g = x; *b = y;
	}
}

RgbFColor* RgbF_CreateFromHsi(double h, double s, double i)
{
    RgbFColor* color = NULL;
    if(Hsi_IsValid(h,s,i)==true)
    {
        color = RgbF_Create(0.0,0.0,0.0);
        if(h>=0.0 && h<=(HUE_UPPER_LIMIT/3.0))
        {
            color->B = (1.0/3.0)*(1.0-s);
            color->R = (1.0/3.0)*((s*cos(h))/cos(60.0-h));
            color->G = 1.0-(color->B + color->R);
        }
        else if(h>(HUE_UPPER_LIMIT/3.0) && h<=(2.0*HUE_UPPER_LIMIT/3.0))
        {
            h-=(HUE_UPPER_LIMIT/3.0);
            color->R = (1.0/3.0)*(1.0-s);
            color->G = (1.0/3.0)*((s*cos(h))/cos(60.0-h));
            color->B = 1.0-(color->G + color->R);

        }
        else /* h>240 h<360 */
        {
            h-=(2.0*HUE_UPPER_LIMIT/3.0);
            color->G = (1.0/3.0)*(1.0-s);
            color->B = (1.0/3.0)*((s*cos(h))/cos(60.0-h));
            color->R = 1.0-(color->G + color->B);
        }
    }
    return color;
}
