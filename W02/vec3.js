class Vec3
{
    constructor(x, y, z)
    {
	this.x = x;
	this.y = y;
	this.z = z;
    }

    add(v)
    {
	this.x += v.x;
	this.y += v.y;
	this.z += v.z;
	return this;
    }

    sum()
    {
	return this.x + this.y + this.z;
    }

    min()
    {
	var min = this.x;
	if(min > this.y){
	    min = this.y;
	}
	if(min > this.z){
	    min = this.z;
	}
	return min;
    }

    max()
    {
	var max = this.x;
	if(max < this.y){
	    max = this.y;
	}
	if(max < this.z){
	    max = this.z;
	}
	return max;
    }

    mid()
    {
	var mid = this.x;
	if(mid == this.max() || mid == this.min()){
	    mid = this.y;
	    if(mid == this.max() || mid == this.min()){
		mid = this.z;
	    }
	}
	return mid;
    }
}

