/*
Copyright (C) 2008-10 University of North Carolina at Chapel Hill.
All rights reserved.
Permission to use, copy, modify, and distribute this software and its
documentation for educational, research, and non-profit purposes, without fee,
and without a written agreement is hereby granted, provided that the above
copyright notice, this paragraph, and the following four paragraphs appear in
all copies.
Permission to incorporate this software into commercial products may be obtained
by contacting the University of North Carolina at Chapel Hill.
This software program and documentation are copyrighted by the University of
North Carolina at Chapel Hill. The software program and documentation are
supplied "as is", without any accompanying services from the University of North
Carolina at Chapel Hill or the authors. The University of North Carolina at
Chapel Hill and the authors do not warrant that the operation of the program
will be uninterrupted or error-free. The end-user understands that the program
was developed for research purposes and is advised not to rely exclusively on
the program for any reason.
IN NO EVENT SHALL THE UNIVERSITY OF NORTH CAROLINA AT CHAPEL HILL OR ITS
EMPLOYEES OR THE AUTHORS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL,
INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE
USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF THE UNIVERSITY OF NORTH
CAROLINA AT CHAPEL HILL OR THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF
SUCH DAMAGE.
THE UNIVERSITY OF NORTH CAROLINA AT CHAPEL HILL AND THE AUTHORS SPECIFICALLY
DISCLAIM ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE AND ANY STATUTORY
WARRANTY OF NON-INFRINGEMENT. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS IS"
BASIS, AND THE UNIVERSITY OF NORTH CAROLINA AT CHAPEL HILL AND THE AUTHORS HAVE
NO OBLIGATIONS TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
MODIFICATIONS.
*/

/**Reciprocal Velocity Obstacles 
 * 相互速度障碍 
 * */
var RVO = RVO || {};


/**
 * 代理
 * @param {*} sim 模拟电脑
 */
RVO.Agent = function (sim) {
    //模拟电脑 
    this.sim = sim;

    //代理邻居组 
    this.agentNeighbors = [];
    //最大邻居数 
    this.maxNeighbors = 0;
    //最大速度 
    this.maxSpeed = 0;
    //邻居距离 
    this.neighborDist = 0;
    //新速度 
    this.newVelocity = [0, 0];
    //障碍邻居组 
    this.obstacleNeighbors = [];
    //最优交互避碰线组 
    this.orcaLines = [];
    //位置 
    this.position = [0, 0];
    //模拟电脑 
    this.sim = sim;
    //时间跨度 
    this.timeHorizon = 0;
    //时间跨度障碍 
    this.timeHorizonObst = 0;
    //速度 
    this.velocity = [0, 0];
    //id 
    this.id = 0;
}


/**
 * 碰撞责任
 * @param {*} other 其他模拟器
 * 
 */
RVO.Agent.prototype.collisionAvoidance = function (other) {
    var c = 0.5
    /*if(this.id > other.id){
        c =  0.001
    }else if(this.id < other.id){
        c =  0.999//1//0.001
    }*/
    return c
}



/**
 * 计算邻居组
 */
RVO.Agent.prototype.computeNeighbors = function () {
    //障碍邻居组 
    this.obstacleNeighbors = [];
    //距离平方 = 平方( 时间跨度障碍 * 最大速度 + 半径 ) 
    var rangeSq = RVO.sqr(this.timeHorizonObst * this.maxSpeed + this.radius);
    //模拟电脑 kd树 计算障碍邻居组(this ,距离平方 )
    this.sim.kdTree.computeObstacleNeighbors(this, rangeSq);
    //代理邻居组 
    this.agentNeighbors = [];
    //如果(最大邻居数 > 0) 
    if (this.maxNeighbors > 0) {
        //距离平方 =  平方( 邻居距离 )
        rangeSq = RVO.sqr(this.neighborDist);
        //模拟电脑 kd树 计算代理邻居组(this ,距离平方 )
        this.sim.kdTree.computeAgentNeighbors(this, rangeSq);
    }
}

/**
 * 计算新速度
 */
RVO.Agent.prototype.computeNewVelocity = function () {
    //最优交互避碰线组 
    this.orcaLines = [];
    //求逆时间跨度障碍 = 1/时间跨度障碍 
    var invTimeHorizonObst = 1 / this.timeHorizonObst;

    //在碰撞邻居组中循环 
    /**添加碰撞障碍物的orca */
    for (var i = 0, ilen = this.obstacleNeighbors.length; i < ilen; ++i) {
        //障碍1 障碍邻居组[i][1]
        var obstacle1 = this.obstacleNeighbors[i][1],
            //障碍2 = 障碍1 下一个障碍 
            obstacle2 = obstacle1.nextObstacle,
            //相对位置1 = 减去(障碍1 点 , 位置) 
            relativePosition1 = RVO.Vector.subtract(obstacle1.point, this.position),
            // 相对位置2 = 减去(障碍2 点 , 位置)
            relativePosition2 = RVO.Vector.subtract(obstacle2.point, this.position),
            //已经涵盖 = false 
            alreadyCovered = false;

        //  最优交互避碰线组  
        for (var j = 0, jlen = this.orcaLines.length; j < jlen; ++j) {
            //向量积(相乘(相对位置1, 最优交互避碰线组[j][0], 求逆时间跨度障碍), 最优交互避碰线组[j][1])
            if (
                RVO.Vector.det(
                    RVO.Vector.multiply(
                        RVO.Vector.subtract(
                            relativePosition1,
                            this.orcaLines[j][0]),
                        invTimeHorizonObst
                    ),
                    this.orcaLines[j][1]
                ) - invTimeHorizonObst * this.radius >= - RVO.EPSILON &&
                //向量积(相乘(相对位置2, 最优交互避碰线组[j][0], 求逆时间跨度障碍), 最优交互避碰线组[j][0])
                RVO.Vector.det(
                    RVO.Vector.multiply(
                        RVO.Vector.subtract(
                            relativePosition2,
                            this.orcaLines[j][0]),
                        invTimeHorizonObst
                    ),
                    this.orcaLines[j][1]
                    // - 求逆时间跨度障碍  * 半径  >= - 小量
                ) - invTimeHorizonObst * this.radius >= - RVO.EPSILON
            ) {
                //已经涵盖 = true  
                alreadyCovered = true;
                break;
            }
        }

        //已经涵盖 = true  
        if (alreadyCovered) {
            //下一个 
            continue;
        }

        //距离平方1 =平方 相对位置1 
        var distSq1 = RVO.Vector.absSq(relativePosition1),
            //距离平方2 =平方 相对位置2 
            distSq2 = RVO.Vector.absSq(relativePosition2),
            //半径平方 = 平方 半径 
            radiusSq = RVO.sqr(this.radius),
            //相对向量 = 障碍2位置 - 障碍1 位置 
            obstacleVector = RVO.Vector.subtract(obstacle2.point, obstacle1.point),
            //s = 数量积 / 相对向量平方 
            s = RVO.Vector.dotProduct(
                //相反 相对位置1 
                RVO.Vector.invert(relativePosition1),
                //相对向量 
                obstacleVector) /
                //相对向量 平方 
                RVO.Vector.absSq(obstacleVector),
            //到线距离平方 =   相反 相对位置1
            distSqLine = RVO.Vector.absSq(
                //相减 
                RVO.Vector.subtract(
                    //相反 相对位置1 
                    RVO.Vector.invert(relativePosition1),
                    //相对向量 相乘 s 
                    RVO.Vector.multiply(obstacleVector, s)
                )
            ),
            //线  = [] 
            line = new Array(2);

        if (s < 0 && distSq1 <= radiusSq) {
            if (obstacle1.isConvex) {
                line[0] = [0, 0];
                line[1] = RVO.Vector.normalize([- relativePosition1[1], relativePosition1[0]]);
                this.orcaLines.push(line);
            }
            continue;
        }
        else if (s > 1 && distSq2 <= radiusSq) {
            if (obstacle2.isConvex && RVO.Vector.det(relativePosition2, obstacle2.unitDir) >= 0) {
                line[0] = [0, 0];
                line[1] = RVO.Vector.normalize([- relativePosition2[1], relativePosition2[0]]);;
                this.orcaLines.push(line);
            }
            continue;
        }
        else if (s >= 0 && s < 1 && distSqLine <= radiusSq) {
            line[0] = [0, 0];
            line[1] = RVO.Vector.invert(obstacle1.unitDir);
            this.orcaLines.push(line);
            continue;
        }

        var leftLegDirection, rightLegDirection;

        if (s < 0 && distSqLine <= radiusSq) {
            if (!obstacle1.isConvex) {
                continue;
            }

            obstacle2 = obstacle1;

            var leg1 = Math.sqrt(distSq1 - radiusSq);
            leftLegDirection = RVO.Vector.divide([relativePosition1[0] * leg1 - relativePosition1[1] * this.radius, relativePosition1[0] * this.radius + relativePosition1[1] * leg1], distSq1);
            rightLegDirection = RVO.Vector.divide([relativePosition1[0] * leg1 + relativePosition1[1] * this.radius, - relativePosition1[0] * this.radius + relativePosition1[1] * leg1], distSq1);
        }
        else if (s > 1 && distSqLine <= radiusSq) {
            if (!obstacle2.isConvex) {
                continue;
            }

            obstacle1 = obstacle2;

            var leg2 = Math.sqrt(distSq2 - radiusSq);
            leftLegDirection = RVO.Vector.divide([relativePosition2[0] * leg2 - relativePosition2[1] * this.radius, relativePosition2[0] * this.radius + relativePosition2[1] * leg2], distSq2);
            rightLegDirection = RVO.Vector.divide([relativePosition2[0] * leg2 + relativePosition2[1] * this.radius, - relativePosition2[0] * this.radius + relativePosition2[1] * leg2], distSq2);
        }
        else {
            if (obstacle1.isConvex) {
                leg1 = Math.sqrt(distSq1 - radiusSq);
                leftLegDirection = RVO.Vector.divide([relativePosition1[0] * leg1 - relativePosition1[1] * this.radius, relativePosition1[0] * this.radius + relativePosition1[1] * leg1], distSq1);
            }
            else {
                leftLegDirection = RVO.Vector.invert(obstacle1.unitDir);
            }

            if (obstacle2.isConvex) {
                leg2 = Math.sqrt(distSq2 - radiusSq);
                rightLegDirection = RVO.Vector.divide([relativePosition2[0] * leg2 + relativePosition2[1] * this.radius, - relativePosition2[0] * this.radius + relativePosition2[1] * leg2], distSq2);
            }
            else {
                rightLegDirection = obstacle1.unitDir;
            }
        }

        var leftNeighbor = obstacle1.prevObstacle,
            isLeftLegForeign = false,
            isRightLegForeign = false;

        if (obstacle1.isConvex && RVO.Vector.det(leftLegDirection, RVO.Vector.invert(leftNeighbor.unitDir)) >= 0) {
            leftLegDirection = RVO.Vector.invert(leftNeighbor.unitDir);
            isLeftLegForeign = true;
        }

        if (obstacle2.isConvex && RVO.Vector.det(rightLegDirection, obstacle2.unitDir) <= 0) {
            rightLegDirection = RVO.Vector.invert(obstacle2.unitDir);
            isRightLegForeign = true;
        }

        var leftCutoff = RVO.Vector.multiply(RVO.Vector.subtract(obstacle1.point, this.position), invTimeHorizonObst),
            rightCutoff = RVO.Vector.multiply(RVO.Vector.subtract(obstacle2.point, this.position), invTimeHorizonObst),
            cutoffVec = RVO.Vector.subtract(rightCutoff, leftCutoff),
            t = (obstacle1 == obstacle2) ? .5 : RVO.Vector.dotProduct(RVO.Vector.subtract(this.velocity, leftCutoff), cutoffVec) / RVO.Vector.absSq(cutoffVec),
            tLeft = RVO.Vector.dotProduct(RVO.Vector.subtract(this.velocity, leftCutoff), leftLegDirection),
            tRight = RVO.Vector.dotProduct(RVO.Vector.subtract(this.velocity, rightCutoff), rightLegDirection);

        if ((t < 0 && tLeft < 0) || (obstacle1 == obstacle2 && tLeft < 0 && tRight < 0)) {
            var unitW = RVO.Vector.normalize(RVO.Vector.subtract(this.velocity, leftCutoff));
            line[1] = [unitW[1], - unitW[0]];
            line[0] = RVO.Vector.add(RVO.Vector.multiply(unitW, this.radius * invTimeHorizonObst), leftCutoff);
            this.orcaLines.push(line);
            continue;
        }
        else if (t > 1 && tRight < 0) {
            var unitW = RVO.Vector.normalize(RVO.Vector.subtract(this.velocity, rightCutoff));
            line[1] = [unitW[1], - unitW[0]];
            line[0] = RVO.Vector.add(RVO.Vector.multiply(unitW, this.radius * invTimeHorizonObst), rightCutoff);
            this.orcaLines.push(line);
            continue;
        }

        var distSqCutoff = (t < 0 || t > 1 || obstacle1 == obstacle2) ?
            Infinity :
            RVO.Vector.lineSq(this.velocity, RVO.Vector.add(leftCutoff, RVO.Vector.multiply(cutoffVec, t))),
            distSqLeft = tLeft < 0 ?
                Infinity :
                RVO.Vector.lineSq(this.velocity, RVO.Vector.add(leftCutoff, RVO.Vector.multiply(leftLegDirection, tLeft))),
            distSqRight = tRight < 0 ?
                Infinity :
                RVO.Vector.lineSq((this.velocity, RVO.Vector.add(rightCutoff, RVO.Vector.multiply(rightLegDirection, tRight))));

        if (distSqCutoff <= distSqLeft && distSqCutoff <= distSqRight) {
            line[1] = RVO.Vector.invert(obstacle1.unitDir);
            line[0] = RVO.Vector.add(leftCutoff, RVO.Vector.multiply([- line[1][1], line[1][0]], this.radius * invTimeHorizonObst));
            this.orcaLines.push(line);
            continue;
        }
        else if (distSqLeft <= distSqRight) {
            if (isLeftLegForeign) {
                continue;
            }

            line[1] = leftLegDirection;
            line[0] = RVO.Vector.add(leftCutoff, RVO.Vector.multiply([- line[1][1], line[1][0]], this.radiuis * invTimeHorizonObst));
            this.orcaLines.push(line);
            continue;
        }
        else {
            if (isRightLegForeign) {
                continue;
            }

            line[1] = RVO.Vector.invert(rightLegDirection);
            line[0] = RVO.Vector.add(rightCutoff, RVO.Vector.multiply([line[1][1], line[1][0]], this.radius * invTimeHorizonObst));
            this.orcaLines.push(line);
            continue;
        }
    }

    var numObstLines = this.orcaLines.length,
        invTimeHorizon = 1 / this.timeHorizon;

    /**添加代理造成的orca */
    for (var i = 0, len = this.agentNeighbors.length; i < len; ++i) {
        var other = this.agentNeighbors[i][1],
            relativePosition = RVO.Vector.subtract(other.position, this.position),
            relativeVelocity = RVO.Vector.subtract(this.velocity, other.velocity),
            distSq = RVO.Vector.absSq(relativePosition),
            combinedRadius = this.radius + other.radius,
            combinedRadiusSq = RVO.sqr(combinedRadius),
            line = new Array(2);

                /**没有碰撞。 */
        if (distSq > combinedRadiusSq) {
            var w = RVO.Vector.subtract(relativeVelocity, RVO.Vector.multiply(relativePosition, invTimeHorizon)),
				/* 从截止中心到相对速度的矢量 */
                wLengthSq = RVO.Vector.absSq(w),
                dotProduct1 = RVO.Vector.dotProduct(w, relativePosition);

            if (dotProduct1 < 0 && RVO.sqr(dotProduct1) > combinedRadiusSq * wLengthSq) {
                /* 关于截止圆的项目。*/
                var wLength = Math.sqrt(wLengthSq),
                    unitW = RVO.Vector.divide(w, wLength),
                    u = RVO.Vector.multiply(unitW, combinedRadius * invTimeHorizon - wLength);

                line[1] = [unitW[1], - unitW[0]];
            }
            else {
                var leg = Math.sqrt(distSq - combinedRadius);

                if (RVO.Vector.det(relativePosition, w) > 0) {
                    line[1] = RVO.Vector.divide([relativePosition[0] * leg - relativePosition[1] * combinedRadius, relativePosition[0] * combinedRadius + relativePosition[1] * leg], distSq)
                }
                else {
                    line[1] = RVO.Vector.divide(RVO.Vector.invert([relativePosition[0] * leg - relativePosition[1] * combinedRadius, relativePosition[0] * combinedRadius + relativePosition[1] * leg]), distSq)
                }

                var dotProduct2 = RVO.Vector.dotProduct(relativeVelocity, line[1]),
                    u = RVO.Vector.multiply(RVO.Vector.subtract(line[1], relativeVelocity), dotProduct2);
            }
        }
        else {
            
				/* Collision. Project on cut-off circle of time timeStep. */
                /**碰撞。 关于时间截止圆的项目步骤。*/
            var invTimeStep = this.invtimeStep,
            		/* Vector from cutoff center to relative velocity. */
                /*从截止中心到相对速度的矢量。*/
                w = RVO.Vector.subtract(relativeVelocity, RVO.Vector.multiply(relativePosition, invTimeStep)),
                wLength = RVO.Vector.abs(w),
                unitW = RVO.Vector.divide(w, wLength),
                u = RVO.Vector.multiply(unitW, combinedRadius * invTimeStep - wLength);

            line[1] = [unitW[1], - unitW[0]];
        }

        /**避障责任 */
        var c = this.collisionAvoidance(other)
        
        line[0] = RVO.Vector.add(this.velocity, RVO.Vector.multiply(u, c))// .5));
        this.orcaLines.push(line);
    }

    var lineFail = RVO.Agent.linearProgram2(this.orcaLines, this.maxSpeed, this.prefVelocity, false, this.newVelocity);

    if (lineFail < this.orcaLines.length) {
        RVO.Agent.linearProgram3(this.orcaLines, numObstLines, lineFail, this.maxSpeed, this.newVelocity);
    }
}

/**
 * 插入代理邻居
 * @param {*} agent 
 * @param {*} rangeSq 
 */
RVO.Agent.prototype.insertAgentNeighbor = function (agent, rangeSq) {
    if (this != agent) {
        var distSq = RVO.Vector.lineSq(this.position, agent.position);

        if (distSq < rangeSq) {
            if (this.agentNeighbors.length < this.maxNeighbors) {
                this.agentNeighbors.push([distSq, agent]);
            }

            var i = this.agentNeighbors.length - 1;
            while (i != 0 && distSq < this.agentNeighbors[i - 1][0]) {
                this.agentNeighbors[i] = this.agentNeighbors[i - 1];
                --i;
            }
            this.agentNeighbors[i] = [distSq, agent];

            if (this.agentNeighbors.length == this.maxNeighbors) {
                var rangeSq = this.agentNeighbors[this.agentNeighbors.length - 1][0];
            }
        }
    }

    return rangeSq;
}

/**
 * 插入障碍邻居
 * @param {*} obstacle 障碍
 * @param {*} rangeSq 邻居
 */
RVO.Agent.prototype.insertObstacleNeighbor = function (obstacle, rangeSq) {
    //下一个障碍 = 障碍 下一个障碍
    var nextObstacle = obstacle.nextObstacle,
        //距离平方 = 点线段距离(障碍 点 , 下一个障碍 点 , 位置)
        distSq = RVO.Vector.distSqPointLineSegment(obstacle.point, nextObstacle.point, this.position);


    //如果 距离平方 < 区域平方
    if (distSq < rangeSq) {
        //障碍邻居 添加 [距离平方,障碍] 
        this.obstacleNeighbors.push([distSq, obstacle]);

        var i = this.obstacleNeighbors.length - 1;
        while (i != 0 && distSq < this.obstacleNeighbors[i - 1][0]) {
            this.obstacleNeighbors[i] = this.obstacleNeighbors[i - 1];
            --i;
        }
        this.obstacleNeighbors[i] = [distSq, obstacle];
    }
}

/**更新 */
RVO.Agent.prototype.update = function () {
    //速度 = 新速度
    this.velocity = this.newVelocity;

    //移动 位置  = 速度 * 时间步数  
    RVO.Vector.shift(this.position, RVO.Vector.multiply(this.velocity, this.sim.timeStep));
}

/**
 * 线性程序1
 * @param {*} lines 线
 * @param {*} lineNo 线
 * @param {*} radius 半径
 * @param {*} optVelocity 选择速度
 * @param {*} directionOpt  方向选择
 * @param {*} result  结果
 */
RVO.Agent.linearProgram1 = function (lines, lineNo, radius, optVelocity, directionOpt, result) {
    var dotProduct = RVO.Vector.dotProduct(lines[lineNo][0], lines[lineNo][1]),
        discriminant = RVO.sqr(dotProduct) + RVO.sqr(radius) - RVO.Vector.absSq(lines[lineNo][0]);

    if (discriminant < 0) {
        return false;
    }

    var sqrtDiscriminant = Math.sqrt(discriminant),
        tLeft = - dotProduct - sqrtDiscriminant,
        tRight = - dotProduct + sqrtDiscriminant;

    for (var i = 0; i < lineNo; ++i) {
        var denominator = RVO.Vector.det(lines[lineNo][1], lines[i][1]),
            numerator = RVO.Vector.det(lines[i][1], RVO.Vector.subtract(lines[lineNo][0], lines[i][0]));

        if (Math.abs(denominator) <= RVO.EPSILON) {
            if (numerator < 0) {
                return false;
            }
            else {
                continue;
            }
        }

        var t = numerator / denominator;

        if (denominator > 0) {
            tRight = Math.min(tRight, t);
        }
        else {
            tLeft = Math.max(tLeft, t);
        }

        if (tLeft > tRight) {
            return false;
        }
    }

    if (directionOpt) {
        if (RVO.Vector.dotProduct(optVelocity, lines[lineNo][1]) > 0) {
            RVO.Vector.set(result, RVO.Vector.add(lines[lineNo][0], RVO.Vector.multiply(lines[lineNo][1], tRight)));
        }
        else {
            RVO.Vector.set(result, RVO.Vector.add(lines[lineNo][0], RVO.Vector.multiply(lines[lineNo][1], tLeft)));
        }
    }
    else {
        t = RVO.Vector.dotProduct(lines[lineNo][1], RVO.Vector.subtract(optVelocity, lines[lineNo][0]));

        if (t < tLeft) {
            RVO.Vector.set(result, RVO.Vector.add(lines[lineNo][0], RVO.Vector.multiply(lines[lineNo][1], tLeft)));
        }
        else if (t > tRight) {
            RVO.Vector.set(result, RVO.Vector.add(lines[lineNo][0], RVO.Vector.multiply(lines[lineNo][1], tRight)));
        }
        else {
            RVO.Vector.set(result, RVO.Vector.add(lines[lineNo][0], RVO.Vector.multiply(lines[lineNo][1], t)));
        }
    }

    return true;
}

/**
 * 线性程序2
 * @param {*} lines  线
 * @param {*} radius 半径
 * @param {*} optVelocity 选择速度
 * @param {*} directionOpt 方向选择
 * @param {*} result 结果
 */
RVO.Agent.linearProgram2 = function (lines, radius, optVelocity, directionOpt, result) {
    if (directionOpt) {
        RVO.Vector.set(result, RVO.Vector.multiply(optVelocity, radius));
    }
    else if (RVO.Vector.absSq(optVelocity) > RVO.sqr(radius)) {
        RVO.Vector.set(result, RVO.Vector.multiply(RVO.Vector.normalize(optVelocity), radius));
    }
    else {
        RVO.Vector.set(result, optVelocity);
    }

    for (var i = 0, len = lines.length; i < len; ++i) {
        if (RVO.Vector.det(lines[i][1], RVO.Vector.subtract(lines[i][0], result)) > 0) {
            var tempResult = result.slice();
            if (!RVO.Agent.linearProgram1(lines, i, radius, optVelocity, directionOpt, result)) {
                RVO.Vector.set(result, tempResult);
                return i;
            }
        }
    }

    return lines.length;
}

/**
 * 线性程序3
 * @param {*} lines 线
 * @param {*} numObstLines num水果线
 * @param {*} beginLine 起跑线
 * @param {*} radius 半径
 * @param {*} result 结果
 */
RVO.Agent.linearProgram3 = function (lines, numObstLines, beginLine, radius, result) {
    var distance = 0;

    for (var i = beginLine, len = lines.length; i < len; ++i) {
        if (RVO.Vector.det(lines[i][1], RVO.Vector.subtract(lines[i][0], result)) > distance) {
            var projLines = lines.slice(0, numObstLines);

            for (var j = numObstLines; j < i; ++j) {
                var line = new Array(2),
                    determinant = RVO.Vector.det(lines[i][1], lines[j][1]);

                if (Math.abs(determinant) <= RVO.EPSILON) {
                    if (RVO.Vector.dotProduct(lines[i][1], lines[j][1]) > 0) {
                        continue;
                    }
                    else {
                        line[0] = RVO.Vector.multiply(RVO.Vector.add(lines[i][0], lines[j][0]), .5);
                    }
                }
                else {
                    line[0] = RVO.Vector.add(lines[i][0], RVO.Vector.multiply(lines[i][1], RVO.Vector.det(lines[j][1], RVO.Vector.subtract(lines[i][0], lines[j][0])) / determinant))
                }

                line[1] = RVO.Vector.normalize(RVO.Vector.subtract(lines[j][1], lines[i][1]));
                projLines.push(line);
            }

            var tempResult = result.slice();
            if (RVO.Agent.linearProgram2(projLines, radius, [- lines[i][1][1], lines[i][1][0]], true, result) < projLines.length) {
                RVO.Vector.set(result, tempResult);
            }

            distance = RVO.Vector.det(lines[i][1], RVO.Vector.subtract(lines[i][0], result));
        }
    }
}

var RVO = RVO || {};

/**
 * kd树
 * @param {*} sim 
 */
RVO.KdTree = function (sim) {
    this.sim = sim;
    //代理组 = [] 
    this.agents = [];
    //代理树 = [] 
    this.agentTree = [];
    //障碍树 = 0 
    this.obstacleTree = 0;
}

RVO.KdTree.MAX_LEAF_SIZE = 10;

/**
 * 构建代理树
 */
RVO.KdTree.prototype.buildAgentTree = function () {
    //如果 代理数 < sim 代理数 
    if (this.agents.length < this.sim.agents.length) {
        for (var i = this.agents.length, len = this.sim.agents.length; i < len; ++i) {
            //添加 代理 
            this.agents.push(this.sim.agents[i]);
        }
    }

    //代理树 = [] 
    this.agentTree = [];
    if (this.agents.length) {
        // 构建代理树递归 
        this.buildAgentTreeRecursive(0, this.agents.length, 0);
    }
}

/**
 * 构建代理树递归
 * @param {*} begin 
 * @param {*} end 
 * @param {*} node 
 */
RVO.KdTree.prototype.buildAgentTreeRecursive = function (begin, end, node) {
    var agent = this.agentTree[node] = new RVO.KdTree.AgentTreeNode;
    agent.begin = begin;
    agent.end = end;

    agent.minX = agent.maxX = this.agents[begin].position[0];
    agent.minY = agent.maxY = this.agents[begin].position[1];

    for (var i = begin + 1; i < end; ++i) {
        agent.maxX = Math.max(agent.maxX, this.agents[i].position[0]);
        agent.minX = Math.min(agent.minX, this.agents[i].position[0]);
        agent.maxY = Math.max(agent.maxY, this.agents[i].position[1]);
        agent.minY = Math.min(agent.minY, this.agents[i].position[1]);
    }

    if (end - begin > RVO.KdTree.MAX_LEAF_SIZE) {
        var isVertical = agent.maxX - agent.minX > agent.maxY - agent.minY,
            splitValue = isVertical ? .5 * (agent.maxX + agent.minX) : .5 * (agent.maxY + agent.minY),
            left = begin,
            right = end - 1;

        while (true) {
            while (left <= right && (isVertical ? this.agents[left].position[0] : this.agents[left].position[1]) < splitValue) {
                ++left;
            }

            while (right >= left && (isVertical ? this.agents[right].position[0] : this.agents[right].position[1]) >= splitValue) {
                --right;
            }

            if (left > right) {
                break;
            }
            else {
                var tmp = this.agents[right];
                this.agents[right] = this.agents[left];
                this.agents[left] = tmp;
                ++left;
                --right;
            }
        }

        var leftSize = left - begin;

        if (leftSize == 0) {
            ++leftSize;
            ++left;
            ++right;
        }

        agent.left = node + 1;
        agent.right = node + 1 + (2 * leftSize - 1);

        this.buildAgentTreeRecursive(begin, left, agent.left);
        this.buildAgentTreeRecursive(left, end, agent.right);
    }
}

/**
 * 创建障碍树
 */
RVO.KdTree.prototype.buildObstacleTree = function () {
    //障碍组 = []
    var obstacles = [];

    for (var i = 0, len = this.sim.obstacles.length; i < len; ++i) {
        //障碍组 [i] = 障碍组[i] 
        obstacles[i] = this.sim.obstacles[i];
    }

    //障碍树 = 创建障碍树递归(障碍组) 
    this.obstacleTree = this.buildObstacleTreeRecursive(obstacles);
}

/**
 * 创建障碍树递归
 * 
 * @param {*} obstacles 
 */
RVO.KdTree.prototype.buildObstacleTreeRecursive = function (obstacles) {
    //如果(不是 障碍组 长度 )
    if (!obstacles.length) {
        //返回 0
        return 0;
    }
    //否则
    else {
        //节点 = 新 障碍树节点 
        var node = new RVO.KdTree.ObstacleTreeNode,

            optimalSplit = 0,
            obstaclesLength = obstacles.length,
            minLeft = obstaclesLength,
            minRight = obstaclesLength;

        for (var i = 0; i < obstaclesLength; ++i) {
            var leftSize = 0,
                rightSize = 0,
                obstacleI1 = obstacles[i],
                obstacleI2 = obstacleI1.nextObstacle;

            for (var j = 0; j < obstaclesLength; ++j) {
                if (i != j) {
                    var obstacleJ1 = obstacles[j],
                        obstacleJ2 = obstacleJ1.nextObstacle,
                        j1LeftOfI = RVO.Vector.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ1.point),
                        j2LeftOfI = RVO.Vector.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ2.point);

                    if (j1LeftOfI >= - RVO.EPSILON && j2LeftOfI >= - RVO.EPSILON) {
                        ++leftSize;
                    }
                    else if (j1LeftOfI <= RVO.EPSILON && j2LeftOfI <= RVO.EPSILON) {
                        ++rightSize;
                    }
                    else {
                        ++leftSize;
                        ++rightSize;
                    }

                    if (Math.max(leftSize, rightSize) >= Math.min(minLeft, minRight) || Math.min(leftSize, rightSize) >= Math.min(minLeft, minRight)) {
                        break;
                    }
                }
            }

            if (Math.max(leftSize, rightSize) < Math.max(minLeft, minRight) || Math.min(leftSize, rightSize) < Math.min(minLeft, minRight)) {
                minLeft = leftSize;
                minRight = rightSize;
                optimalSplit = i;
            }
        }

        var leftObstacles = [],
            rightObstacles = [],
            i = optimalSplit,
            obstacleI1 = obstacles[i],
            obstacleI2 = obstacleI1.nextObstacle;

        for (var j = 0, len = obstacles.length; j < len; ++j) {
            if (i != j) {
                var obstacleJ1 = obstacles[j],
                    obstacleJ2 = obstacleJ1.nextObstacle,
                    j1LeftOfI = RVO.Vector.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ1.point),
                    j2LeftOfI = RVO.Vector.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ2.point);

                if (j1LeftOfI >= - RVO.EPSILON && j2LeftOfI >= - RVO.EPSILON) {
                    leftObstacles.push(obstacles[j]);
                }
                else if (j1LeftOfI <= RVO.EPSILON && j2LeftOfI <= RVO.EPSILON) {
                    rightObstacles.push(obstacles[j]);
                }
                else {
                    var t = RVO.Vector.det(RVO.Vector.subtract(obstacleI2.point, obstacleI1.point), RVO.Vector.subtract(obstacleJ1.point, obstacleI1.point)) / RVO.Vector.det(RVO.Vector.subtract(obstacleI2.point, obstacleI1.point), RVO.Vector.subtract(obstacleJ1.point, obstacleJ2.point)),
                        splitPoint = RVO.Vector.add(RVO.Vector.multiply(RVO.Vector.subtract(obstacleJ1.point, obstacleJ2.point), t), obstacleJ1.point),
                        newObstacle = new RVO.Obstacle();

                    newObstacle.point = splitPoint;
                    newObstacle.prevObstacle = obstacleJ1;
                    newObstacle.nextObstacle = obstacleJ2;
                    newObstacle.isConvex = true;
                    newObstacle.unitTDir = obstacleJ1.unitDir;
                    newObstacle.id = this.sim.obstacles.length;

                    this.sim.obstacles.push(newObstacle);

                    obstacleJ1.nextObstacle = newObstacle;
                    obstacleJ2.prevObstacle = newObstacle;

                    if (j1LeftOfI > 0) {
                        leftObstacles.push(obstacleJ1);
                        rightObstacles.push(newObstacle);
                    }
                    else {
                        rightObstacles.push(obstacleJ1);
                        leftObstacles.push(newObstacle);
                    }
                }
            }
        }

        node.obstacle = obstacleI1;
        node.left = this.buildObstacleTreeRecursive(leftObstacles);
        node.right = this.buildObstacleTreeRecursive(rightObstacles);
        return node;
    }

}


/**
 * 计算代理邻居组 
 * @param {*} agent 
 * @param {*} rangeSq 
 */
RVO.KdTree.prototype.computeAgentNeighbors = function (agent, rangeSq) {
    //查询代理树递归
    this.queryAgentTreeRecursive(agent, rangeSq, 0);
}

/**
 * 计算障碍邻居组
 * @param {*} agent 
 * @param {*} rangeSq 
 */
RVO.KdTree.prototype.computeObstacleNeighbors = function (agent, rangeSq) {
    //查询障碍树递归
    this.queryObstacleTreeRecursive(agent, rangeSq, this.obstacleTree);
}

/**
 * 查询代理树递归
 * @param {*} agent 
 * @param {*} rangeSq 
 * @param {*} node 
 */
RVO.KdTree.prototype.queryAgentTreeRecursive = function (agent, rangeSq, node) {
    //节点代理 = 代理树 节点
    var nodeAgent = this.agentTree[node],
        //新范围平方 = 范围平方 
        newRangeSq = rangeSq;
    //如果(节点代理 结束 - 节点代理 开始 <= 最大叶片尺寸) 
    if (nodeAgent.end - nodeAgent.begin <= RVO.KdTree.MAX_LEAF_SIZE) {
        //循环  
        for (var i = nodeAgent.begin, len = nodeAgent.end; i < len; ++i) {
            //新范围平方 = 节点  插入代理邻居(代理,新范围平方 )
            newRangeSq = agent.insertAgentNeighbor(this.agents[i], newRangeSq);
        }
    }
    else {
        //距离平方左 = 0 
        var distSqLeft = 0,
            //距离平方右 = 0 
            distSqRight = 0,
            //左代理 = 代理树 节点代理 左 
            leftAgent = this.agentTree[nodeAgent.left],
            //右代理 = 代理树 节点代理 右 
            rightAgent = this.agentTree[nodeAgent.right];

        //代理 位置x < 最小x 
        if (agent.position[0] < leftAgent.minX) {
            //距离平方左 += 平方( 左代理 最小x - 代理 位置[0]) 
            distSqLeft += RVO.sqr(leftAgent.minX - agent.position[0]);
        }
        //代理 位置x > 最大x 
        else if (agent.position[0] > leftAgent.maxX) {
            //距离平方左 += 
            distSqLeft += RVO.sqr(agent.position[0] - leftAgent.maxX);
        }

        //代理 位置y < 最小y 
        if (agent.position[1] < leftAgent.minY) {
            distSqLeft += RVO.sqr(leftAgent.minY - agent.position[1]);
        }
        //代理 位置y> 最大y 
        else if (agent.position[1] > leftAgent.maxY) {
            distSqLeft += RVO.sqr(agent.position[1] - leftAgent.maxY);
        }

        if (agent.position[0] < rightAgent.minX) {
            distSqRight += RVO.sqr(rightAgent.minX - agent.position[0]);
        }
        else if (agent.position[0] > rightAgent.maxX) {
            distSqRight += RVO.sqr(agent.position[0] - rightAgent.maxX);
        }

        if (agent.position[1] < rightAgent.minY) {
            distSqRight += RVO.sqr(rightAgent.minY - agent.position[1]);
        }
        else if (agent.position[1] > rightAgent.maxY) {
            distSqRight += RVO.sqr(agent.position[1] - rightAgent.maxY);
        }
        //如果 距离左 < 距离右 
        if (distSqLeft < distSqRight) {
            //如果(距离左 < 范围) 
            if (distSqLeft < rangeSq) {
                //新范围平方 =  查询代理树递归 
                newRangeSq = this.queryAgentTreeRecursive(agent, newRangeSq, nodeAgent.left);
                //如果 距离右 < 范围平方 
                if (distSqRight < rangeSq) {
                    //新范围平方 =  查询代理树递归 
                    newRangeSq = this.queryAgentTreeRecursive(agent, newRangeSq, nodeAgent.right);
                }
            }
        }
        //否则 
        else {
            //如果 距离右 < 范围平方 
            if (distSqRight < rangeSq) {
                //新范围平方 =  查询代理树递归 
                newRangeSq = this.queryAgentTreeRecursive(agent, newRangeSq, nodeAgent.right);
                //如果(距离左 < 范围) 
                if (distSqLeft < rangeSq) {
                    //新范围平方 =  查询代理树递归 
                    newRangeSq = this.queryAgentTreeRecursive(agent, newRangeSq, nodeAgent.left);
                }
            }
        }
    }
    //返回 新范围平方 
    return newRangeSq;
}

/**
 * 查询障碍树递归
 * @param {*} agent 
 * @param {*} rangeSq 
 * @param {*} node 
 */
RVO.KdTree.prototype.queryObstacleTreeRecursive = function (agent, rangeSq, node) {
    //如果(节点 == 0 )
    if (node == 0) {
        return;
    }
    else {
        //障碍1 
        var obstacle1 = node.obstacle,
            //障碍2 
            obstacle2 = obstacle1.nextObstacle,
            //代理 在线左边  
            agentLeftOfLine = RVO.Vector.leftOf(obstacle1.point, obstacle2.point, agent.position),
            //到线距离的平方 =  
            distSqLine = RVO.sqr(agentLeftOfLine) / RVO.Vector.lineSq(obstacle2.point, obstacle1.point);

        //查询障碍树递归(如果在左侧 左树) 
        this.queryObstacleTreeRecursive(agent, rangeSq, agentLeftOfLine >= 0 ? node.left : node.right);

        //如果 距离 小于区域距离平方 
        if (distSqLine < rangeSq) {
            //如果(代理 不在线左方 ) 
            if (agentLeftOfLine < 0) {
                //插入障碍邻居 
                agent.insertObstacleNeighbor(node.obstacle, rangeSq);
            }
            //查询障碍树递归(如果在左侧 右树) 
            this.queryObstacleTreeRecursive(agent, rangeSq, agentLeftOfLine >= 0 ? node.right : node.left);
        }
    }
}

/**
 * 查询可见性
 * @param {*} q1 
 * @param {*} q2 
 * @param {*} radius 
 */
RVO.KdTree.prototype.queryVisibility = function (q1, q2, radius) {
    //返回 查询可见性递归
    return this.queryVisibilityRecursive(q1, q2, radius, this.obstacleTree)
}

/**
 * 查询可见性递归
 * @param {*} q1 点1
 * @param {*} q2 点2
 * @param {*} radius 半径
 * @param {*} node 节点
 */
RVO.KdTree.prototype.queryVisibilityRecursive = function (q1, q2, radius, node) {
    //如果(节点 ) 
    if (node.obstacleNo == -1) {
        //返回 true 
        return true;
    }
    else {
        //障碍 = 障碍组[节点 障碍索引]
        var obstacle = this.sim.obstacles[node.obstacleNo],
            //点q1 在 障碍 左边 ? 
            q1LeftOfI = RVO.Vector.leftOf(obstacle.point1, obstacle.point2, q1),
            //点q2 在 障碍 左边 ? 
            q2LeftOfI = RVO.Vector.leftOf(obstacle.point1, obstacle.point2, q2);

        //如果(p1 p2 都在左边 ) 
        if (q1LeftOfI >= 0 && q2LeftOfI >= 0) {
            //返回 查询可见性递归 左枝 
            return this.queryVisibilityRecursive(q1, q2, radius, node.left);
        }
        //如果(p1 p2 都在右边 ) 
        else if (q1LeftOfI <= 0 && q2LeftOfI <= 0) {
            //返回 查询可见性递归 左枝 
            return this.queryVisibilityRecursive(q1, q2, radius, node.right);
        }
        else {
            // 障碍点1 在 点1点2左边 
            var point1LeftOfQ = RVO.Vector.leftOf(q1, q2, obstacle.point1),
                // 障碍点2 在 点1点2左边 
                point2LeftOfQ = RVO.Vector.leftOf(q1, q2, obstacle.point2),
                //1/ 点1点2距离 
                invLengthQ = 1 / RVO.Vector.lineSq(q2, q1);;

            //返回 不在同一侧 
            return point1LeftOfQ * point2LeftOfQ >= 0 &&
                RVO.sqr(point1LeftOfQ) * invLengthQ >= RVO.sqr(radius) &&
                RVO.sqr(point2LeftOfQ) * invLengthQ >= RVO.sqr(radius) &&
                this.queryVisibilityRecursive(q1, q2, radius, node.left) &&
                this.queryVisibilityRecursive(q1, q2, radius, node.right);
        }
    }
}

/**代理树节点 */
RVO.KdTree.AgentTreeNode = function () {
    this.begin = 0;
    this.end = 0;
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
    this.left = 0;
    this.right = 0;
}

/**
 * 障碍树节点
 * 
 */
RVO.KdTree.ObstacleTreeNode = function () {
    this.left = null;
    this.right = null;
    this.obstacle = 0;
}
var RVO = RVO || {};

/**
 * 障碍 
 * */
RVO.Obstacle = function () {
    this.isConvex = false;
    this.nextobstacle = 0;
    this.point = [0, 0];
    this.prevObstacle = 0;
    this.unitDir = [0, 0];
    this.id = 0;
}

var RVO = RVO || {};

/**小量 */
RVO.EPSILON = .00001;

RVO.agentDefaults = {
    neighborDist: 50,
    maxNeighbors: 5,
    maxSpeed: 1,
    radius: 10,
    timeHorizon: 10,
    velocity: [0, 0]
}

/**平方 */
RVO.sqr = function (a) {
    return a * a;
}

if (typeof define === "function" && define.amd && define.amd.RVO) {
    define('RVO', [], function () {
        return RVO;
    });
}

if (typeof module === 'object' && module.exports) {
    module.exports = RVO;
}

var RVO = RVO || {};
/**
 * 模拟器
 * @param {*} timeStep 时间步数
 * @param {*} neighborDist 邻居距离 
 * @param {*} maxNeighbors 最大邻居数 
 * @param {*} timeHorizon 时间跨度
 * @param {*} timeHorizonObst 时间跨度障碍
 * @param {*} radius 半径
 * @param {*} maxSpeed 最大速度
 * @param {*} velocity 速度  
 */
RVO.Simulator = function (timeStep, neighborDist, maxNeighbors, timeHorizon, timeHorizonObst, radius, maxSpeed, velocity) {
    this.timeStep = timeStep;

    /**预先计算 */
    this.invtimeStep = 1/ timeStep;

    this.agents = [];
    this.globalTime = 0;
    this.obstacles = [];
    this.kdTree = new RVO.KdTree(this);
    this.agentDefaults = {};

    this.agentDefaults.neighborDist = neighborDist || RVO.agentDefaults.neighborDist;
    this.agentDefaults.maxNeighbors = maxNeighbors || RVO.agentDefaults.maxNeighbors;
    this.agentDefaults.maxSpeed = maxSpeed || RVO.agentDefaults.maxSpeed;
    this.agentDefaults.radius = radius || RVO.agentDefaults.radius;
    this.agentDefaults.timeHorizon = timeHorizon || RVO.agentdefaults.timeHorizon;
    this.agentDefaults.timeHorizonObst = timeHorizonObst || RVO.agentDefaults.timeHorizonObst;
    this.agentDefaults.velocity = velocity || RVO.agentdefaults.velocity;
}

/**
 * 添加代理
 * @param {*} position 位置
 * @param {*} neighborDist 邻居距离
 * @param {*} maxNeighbors 最大邻居数 
 * @param {*} timeHorizon 时间跨度
 * @param {*} timeHorizonObst 时间跨度障碍
 * @param {*} radius 半径
 * @param {*} maxSpeed 最大速度
 * @param {*} velocity 速度
 * @returns {number} 索引
 */
RVO.Simulator.prototype.addAgent = function (position, neighborDist, maxNeighbors, timeHorizon, timeHorizonObst, radius, maxSpeed, velocity) {
    var agent = new RVO.Agent(this);

    agent.position = position || this.agentDefaults.position;
    agent.maxNeighbors = maxNeighbors || this.agentDefaults.maxNeighbors;
    agent.maxSpeed = maxSpeed || this.agentDefaults.maxSpeed;
    agent.neighborDist = neighborDist || this.agentDefaults.neighborDist;
    agent.radius = radius || this.agentDefaults.radius;
    agent.timeHorizon = timeHorizon || this.agentDefaults.timeHorizon;
    agent.timeHorizonObst = timeHorizonObst || this.agentDefaults.timeHorizonObst;
    agent.velocity = velocity || this.agentDefaults.velocity;
    agent.id = this.agents.length;

    /**代理组 添加(代理) */
    this.agents.push(agent);

    /**返回 代理组 长度 -1 */
    return this.agents.length - 1;
}

/**
 * 添加障碍
 * @param {[[number,number]]} vertices 变量组 
 * @returns {number}
 * 
 */
RVO.Simulator.prototype.addObstacle = function (vertices) {
    /**顶点障碍物 */
    if (vertices.length < 2) {
        /**使用少于两个顶点创建障碍物 */
        throw new Error('Obstacle created with less than two vertices');
    }

    //障碍组长度    
    var obstacleNo = this.obstacles.length;

    for (var i = 0, len = vertices.length; i < len; ++i) {
        //阻碍 = 新 阻碍 
        var obstacle = new RVO.Obstacle();
        //阻碍 点 = 向量组[u] 
        obstacle.point = vertices[i];
        //如果 i!==0 
        if (i != 0) {
            //障碍 预先障碍 = 障碍组 最后一个 
            obstacle.prevObstacle = this.obstacles[this.obstacles.length - 1];
            //障碍 预先障碍 下一个障碍 = 障碍 
            obstacle.prevObstacle.nextObstacle = obstacle;
        }
        //如果 i = 向量组长度 
        if (i == vertices.length - 1) {
            //障碍 下一个障碍 = 障碍[障碍组长度] 
            obstacle.nextObstacle = this.obstacles[obstacleNo];
            //障碍 下一个障碍 预先障碍 = 障碍 
            obstacle.nextObstacle.prevObstacle = obstacle;
        }
        //障碍 单位方向 = 法向量(下一个 减当前 ) 
        obstacle.unitDir = RVO.Vector.normalize(RVO.Vector.subtract(vertices[i == vertices.length - 1 ? 0 : i + 1], vertices[i]));

        //如果 (变量组 长度 == 2) 
        if (vertices.length == 2) {
            //阻碍 是凸的 = true  
            obstacle.isConvex = true;
        }
        else {
            //阻碍 是盒子 =    
            obstacle.isConvex = (RVO.Vector.leftOf(vertices[i == 0 ? vertices.length - 1 : i - 1], vertices[i], vertices[i == vertices.length - 1 ? 0 : i + 1]) >= 0);
        }
        //阻碍 id  = 阻碍组 长度 
        obstacle.id = this.obstacles.length;
        //阻碍组 添加 阻碍 
        this.obstacles.push(obstacle);
    }
    //返回 障碍组长度
    return obstacleNo;
}

/**进行障碍组 */
RVO.Simulator.prototype.processObstacles = function () {
    //kd树 创建障碍树() 
    this.kdTree.buildObstacleTree();
}

RVO.Simulator.prototype.doStep = function () {

    /**预先计算 */
    this.invtimeStep = 1/ this.timeStep;


    //kd树 创建代理树() 
    this.kdTree.buildAgentTree();

    for (var i = 0, len = this.agents.length; i < len; ++i) {
        //代理组[i] 计算邻居组() 
        this.agents[i].computeNeighbors();
        //代理组[i] 计算新速度() 
        this.agents[i].computeNewVelocity();
    }

    for (var i = 0, len = this.agents.length; i < len; ++i) {
        //代理组[i] 更新() 
        this.agents[i].update();
    }

    //全球时间模拟 += 时间步数 
    this.globalTime += this.timeStep;
}

var RVO = RVO || {};


/**向量 */
RVO.Vector = {};

/**
 * 求反 返回 相反向量
 * @param {[number,number]}a
 * @return {[number,number]} [-x,-y]
 */
RVO.Vector.invert = function (a) {
    return [- a[0], - a[1]];
}

/**数量积  
 * @param {[number,number]} a
 * @param {[number,number]} b
 * @return {number} x1*x2+ y1*y2
 * 
*/
RVO.Vector.dotProduct = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

/**相乘  成比例扩大   
 * @param {[number,number]} a
 * @param {number} b
 * @returns {[number,number]} [x * b,y * b]
 * 
*/
RVO.Vector.multiply = function (a, b) {
    return [a[0] * b, a[1] * b];
}

/**相除 成比例缩小  
 * @param {[number,number]} a
 * @param {number} b
 * @returns {[number,number]}  [x / b,y / b]
 * 
*/
RVO.Vector.divide = function (a, b) {
    return [a[0] / b, a[1] / b];
}

/**向量加  两个向量之和
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {[number,number]}  [x1+x2,y1+y2]
 */
RVO.Vector.add = function (a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}

/**向量减  两个向量之差(从b到a的向量)
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {[number,number]} 
 */
RVO.Vector.subtract = function (a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}


/**移动 a的值加上b
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {[number,number]} [x+x1,y+y1]
 */
RVO.Vector.shift = function (a, b) {
    a[0] += b[0];
    a[1] += b[1];
    return a;
}

/**设置  a的值设置为b
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {[number,number]} 
 */
RVO.Vector.set = function (a, b) {
    a[0] = b[0];
    a[1] = b[1];
    return a;
}


/**
 * 距离
 * 数量积平方根  a向量的长度  
 * @param {[number,number]} a 
 * @return {number} 
 */
RVO.Vector.abs = function (a) {
    return Math.sqrt(RVO.Vector.dotProduct(a, a));
}

/** 
 * 数量积  a向量的长度的平方
 * @param {[number,number]} a a点
 * @return {number} 
 * */
RVO.Vector.absSq = function (a) {
    return RVO.Vector.dotProduct(a, a);
}

/**向量积(拟叉积)  
 * 面积*2  当>0 b在a左侧,当<0 b在a右侧
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {number}  
 * */
RVO.Vector.det = function (a, b) {
    //返回 向量的面积(顺逆时针) 
    return a[0] * b[1] - a[1] * b[0];
}


/**法向量 
 * @param {[number,number]} a 
 * @returns {[number,number]} 
 *  
 */
RVO.Vector.normalize = function (a) {
    //返回   相除( a , 距离(a) ) 
    return RVO.Vector.divide(a, RVO.Vector.abs(a));
}

/**在左边 
 * c在ab左边时>0  //四边形的面积
 * @param {[number,number]} a 线段a点[x,y]
 * @param {[number,number]} b 线段b点[x,y]
 * @param {[number,number]} c c点[x,y]
 * @return {number}  向量积(c在ab左边>0) (ab在ca右边)
*/
RVO.Vector.leftOf = function (a, b, c) {
    //返回 拟叉积( ca , ab )
    return RVO.Vector.det(RVO.Vector.subtract(a, c), RVO.Vector.subtract(b, a));
}


/**线段距离的平方
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {number} number
 */
RVO.Vector.lineSq = function (a, b) {
    return RVO.Vector.absSq(RVO.Vector.subtract(a, b));
}



/**点线段距离 
 * c点 到 ab线段的距离
 * @param {[number,number]} a 线段a点[x,y]
 * @param {[number,number]} b 线段b点[x,y]
 * @param {[number,number]} c c点[x,y]
 * @returns {number} 距离值
*/
RVO.Vector.distSqPointLineSegment = function (a, b, c) {
    //ba =  b减a 
    var ba = RVO.Vector.subtract(b, a)
    //ca =  c减a 
    var ca = RVO.Vector.subtract(c, a)
    //r = 数量积(c-a,b-a) / 数量积 b减a  
    var r = RVO.Vector.dotProduct(ca, ba) / RVO.Vector.absSq(ba);

    //如果(r<0 ) 
    if (r < 0) {
        //返回 数量积 c-a 
        return RVO.Vector.absSq(ca);
    }
    //如果(r> 1 ) 
    else if (r > 1) {
        //返回 数量积 c-b 
        return RVO.Vector.lineSq(c, b);
    }
    else {
        //返回 数量积 c- 加 (相乘(ba,r) ,a)
        return RVO.Vector.lineSq(c, RVO.Vector.add(RVO.Vector.multiply(ba, r), a));
    }
}