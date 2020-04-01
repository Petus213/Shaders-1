#version 430

in vec3 vertPos;
in vec3 N;
in vec3 lightPos;
/*TODO:: Complete your shader code for a full Phong shading*/ 

uniform vec3 camPos;

// complete to a full phong shading
layout( location = 0 ) out vec4 FragColour;

struct diffStruct{
	vec3 Kd;            // Diffuse reflectivity
	vec3 Ld;            // Diffuse light intensity
};

struct ambiStruct{
	vec3 Ka;            // Ambient reflectivity
	vec3 La;            // Ambient light intensity
};

struct specStruct{
	vec3 Ks;            // Specular reflectivity
	vec3 Ls;            // Specular light intensity
	float Ns;           // Shininess
};

struct attenStruct{
	float Ac;           // Constant Attenuation
	float Al;           // Linear Attenuation
	float Aq;			// Quadratic Attenuation
};

uniform diffStruct Ds; //Diffuse Struct
uniform ambiStruct As; //Ambient Struct
uniform specStruct Ss; //Specular Struct
uniform attenStruct Ts; //Attenuation Struct (As was already taken.)

//This function provides the Diffuse Lighting
vec4 Diffuse(){
	vec3 L = normalize(lightPos - vertPos);
	vec4 Id = vec4(Ds.Ld,1.0) * max(dot(N,L), 0.0);
	Id = clamp(Id, 0.0, 1.0);
	Id = vec4(Ds.Kd,1.0) * Id;
	return Id;
}

//This function provides the Ambient lighting
vec4 Ambient() {
	vec4 Ia = vec4(As.La* As.Ka, 1.0);
	return Ia;
}

//This function provides the Specular Lighting
vec4 Specular(){
	vec3 V = normalize(camPos - vertPos);
	vec3 R = reflect(-lightPos, N);
	vec4 Is = vec4(Ss.Ks,1.0) * vec4(Ss.Ls, 1.0) * pow(max(dot(V,R), 0.0), Ss.Ns);
	return Is;
}


//This function is for the Attenuation
float Attenuation(){
	vec3 L = normalize(lightPos - vertPos);
	float D = length(L);
	float attenuation = 1/(Ts.Ac + Ts.Al * D + Ts.Aq * pow(D, 2));
	return attenuation;
}


void main() {
	// Here the different types of lighting are set to the Frag Colour
	FragColour = Attenuation() * (Diffuse() + Specular()) + Ambient();

}
