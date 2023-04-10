class SCurveProfile {
    constructor(distance, max_velocity, max_acceleration, jerk) {
        this.distance = distance;
        this.max_velocity = max_velocity;
        this.max_acceleration = max_acceleration;
        this.j = jerk;
        this.a = max_acceleration;
        this.v = max_velocity;
        
        this.t1 = this.a / this.j;
        this.t2 = this.t1 + (this.v - (this.a*this.a / this.j)) / this.a;
        this.t3 = this.t1 + this.t2;
        
        this.t4 = 0;
        this.t5 = 0;
        this.t6 = 0;
        this.t7 = 0;

        /*
        Increasing acceleration
        */
        this.a1 = (t) => {return this.j * t}
        this.v1 = (t) => {return 0.5 * this.j * t * t}

        this.J1 = (t) => {return (1/6)*this.j*t*t*t} 
        this.A1 = (t) => {return 0}
        this.V1 = (t) => {return 0}
        this.Y1 = 0;

        /*
        Constant acceleration
        */
        this.a2 = (t) => {return this.a}
        this.v2 = (t) => {return this.v1(this.t1) + this.a * (t-this.t1)}
        
        this.J2 = (t) => {return 0}
        this.A2 = (t) => {return 0.5 * this.a * Math.pow(t-this.t1, 2)}
        this.V2 = (t) => {return this.v1(this.t1) * (t-this.t1)}

        /*
        Decreasing acceleration
        */
        this.a3 = (t) => {return this.a2(this.t2) - this.j*(t-this.t2)}
        this.v3 = (t) => {return this.v2(this.t2) - 0.5*this.j*Math.pow(t-this.t2, 2) + this.a2(this.t2) * (t-this.t2)}
        
        this.J3 = (t) => {return -(1/6)*this.j*Math.pow(t-this.t2, 3)}
        this.A3 = (t) => {return 0.5 * this.a2(this.t2) * Math.pow(t-this.t2, 2)}
        this.V3 = (t) => {return this.v2(this.t2) * (t-this.t2)}

        /*
        Constant velocity
        */
        this.a4 = (t) => {return 0}
        this.v4 = (t) => {return this.v}
        
        this.J4 = (t) => {return 0}
        this.A4 = (t) => {return 0}
        this.V4 = (t) => {return this.v * (t - this.t3)}

        /*
        Increasing deceleration
        */
        this.a5 = (t) => {return -this.j * (t-this.t4)}
        this.v5 = (t) => {return this.v4(t)+this.a4(t)*(t-this.t4)-0.5*this.j*Math.pow(t-this.t4, 2)}
        
        this.J5 = (t) => {return -(1/6)*this.j*Math.pow(t-this.t4, 3)}
        this.A5 = (t) => {return 0}
        this.V5 = (t) => {return this.v4(t)*(t-this.t4)}

        /*
        Constant deceleration
        */
        this.a6 = (t) => {return -this.a}
        this.v6 = (t) => {return -this.a * (t-this.t5) + this.v5(this.t5)}
        
        this.J6 = (t) => {return 0}
        this.A6 = (t) => {return -0.5*this.a*Math.pow(t-this.t5, 2)}
        this.V6 = (t) => {return this.v5(this.t5)*(t-this.t5)}

        /*
        Decreasing deceleration
        */
        this.a7 = (t) => {return this.j * (t-this.t6) - this.a}
        this.v7 = (t) => {return this.v6(this.t6)+this.a6(this.t6)*(t-this.t6)+0.5*this.j*Math.pow(t-this.t6, 2)}
        
        this.J7 = (t) => {return (1/6)*this.j*Math.pow(t-this.t6, 3)}
        this.A7 = (t) => {return 0.5*this.a6(this.t6)*Math.pow(t-this.t6, 2)}
        this.V7 = (t) => {return this.v6(this.t6)*(t-this.t6)}

        /*
        Position functions
        */
        this.P1 = (t) => {return this.J1(t) + this.A1(t) + this.V1(t) + this.Y1}
        this.P2 = (t) => {return this.J2(t) + this.A2(t) + this.V2(t) + this.P1(this.t1)}
        this.P3 = (t) => {return this.J3(t) + this.A3(t) + this.V3(t) + this.P2(this.t2)}
        this.P4 = (t) => {return this.J4(t) + this.A4(t) + this.V4(t) + this.P3(this.t3)}
        this.P5 = (t) => {return this.J4(t) + this.A4(t) + this.V4(t) + this.P3(this.t3)}
        this.P6 = (t) => {return this.J6(t) + this.A6(t) + this.V6(t) + this.P5(this.t5)}
        this.P7 = (t) => {return this.J7(t) + this.A7(t) + this.V7(t) + this.P6(this.t6)}
        
        this.t4 = this.t3 + (this.distance - 2 * this.P3(this.t3)) / this.v;

        if (this.t4 - this.t3 < 0) {
            console.log("unable to reach max velocity");
            this.v = this.#calculate_max_velocity();
            this.t1 = this.a / this.j;
            this.t2 = this.t1 + (this.v - (this.a*this.a / this.j)) / this.a;
            if (this.t2 - this.t1 < 0) {
                console.log("unable to accelerate");
                this.a = Math.pow(this.v*this.j, 0.5);
                this.t1 = this.a / this.j;
                this.t2 = this.t1 + (this.v - (this.a*this.a / this.j)) / this.a;
            }
        }
        this.t3 = this.t1 + this.t2;
        this.t4 = this.t3 + (this.distance - 2 * this.P3(this.t3)) / this.v;
        this.t5 = this.t4 + this.t1;
        this.t6 = this.t4 + this.t2;
        this.t7 = this.t6 + this.t1;
        
        console.log(this.t1, this.t2, this.t3, this.t4, this.t5, this.t6, this.t7);
    }

    #calculate_max_velocity() {
        let A = 1/this.a;
        let B = (this.t1 + (this.j * this.t1*this.t1) / (2*this.a));
        let C = -2*this.t1*this.t1 + (1/this.a)*this.distance;
        
        return (-B + Math.sqrt(B*B+C)) / A + this.a*this.a / this.j;
    }
    get_max_time() {
        return this.t7;
    }
    get_distance_by_time(t) {
        if (t >= 0 && t <= this.t1) 
            return this.P1(t);
        else if (t > this.t1 && t <= this.t2)
            return this.P2(t);
        else if (t > this.t2 && t <= this.t3)
            return this.P3(t);
        else if (t > this.t3 && t <= this.t4)
            return this.P4(t);
        else if (t > this.t4 && t <= this.t5)
            return this.P5(t);    
        else if (t > this.t5 && t <= this.t6)
            return this.P6(t);
        else if (t > this.t6 && t <= this.t7)
            return this.P7(t);
        else
            return this.P7(this.t7);
    }
    get_velocity_by_time(t) {
        if (t >= 0 && t <= this.t1)
            return this.v1(t);
        else if (t > this.t1 && t <= this.t2)
            return this.v2(t);
        else if (t > this.t2 && t <= this.t3)
            return this.v3(t);
        else if (t > this.t3 && t <= this.t4)
            return this.v4(t);
        else if (t > this.t4 && t <= this.t5)
            return this.v5(t);
        else if (t > this.t5 && t <= this.t6)
            return this.v6(t);
        else if (t > this.t6 && t <= this.t7)
            return this.v7(t);
        else
            return 0;
    }
    get_acceleration_by_time(t) {
        if (t >= 0 && t <= this.t1) 
            return this.a1(t);
        else if (t > this.t1 && t <= this.t2)
            return this.a2(t);
        else if (t > this.t2 && t <= this.t3)
            return this.a3(t);
        else if (t > this.t3 && t <= this.t4)
            return this.a4(t);
        else if (t > this.t4 && t <= this.t5)
            return this.a5(t);    
        else if (t > this.t5 && t <= this.t6)
            return this.a6(t);
        else if (t > this.t6 && t <= this.t7)
            return this.a7(t);
        else
            return this.a7(this.t7);
    }
}

export default SCurveProfile;